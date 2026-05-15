from __future__ import annotations

"""Agent catalogue and deployment endpoints."""

import json
import logging
from datetime import datetime, timezone
from typing import Any, Optional

logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, verify_api_key
from app.core.database import get_db
from app.models.models import ActiveDeployment, AgentCatalog, User
from app.agents.engine import engine as agent_engine
from app.services.stripe_service import TIER_UNLIMITED

router = APIRouter(prefix="/api/agents", tags=["agents"])

# Unauthenticated users on the starter plan get limited deployments.
# "free" no longer exists as a product tier — this is the internal
# fallback for users who have not yet subscribed.
UNSUBSCRIBED_MAX_DEPLOYMENTS = 2


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class AgentOut(BaseModel):
    id: int
    name: str
    slug: str
    category: str
    description: str
    icon_name: Optional[str]
    tools: Any
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_agent(cls, agent: AgentCatalog) -> "AgentOut":
        return cls(
            id=agent.id,
            name=agent.name,
            slug=agent.slug,
            category=agent.category,
            description=agent.description,
            icon_name=agent.icon_name,
            tools=agent.tools,
            is_active=agent.is_active,
            created_at=agent.created_at,
        )


class DeploymentOut(BaseModel):
    id: int
    agent_id: int
    status: str
    deployed_at: datetime
    last_active: Optional[datetime]
    agent: AgentOut
    config: Any

    model_config = {"from_attributes": True}


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4096)
    agent_id: Optional[str] = Field(default=None, pattern=r"^[a-zA-Z0-9\-_]{1,80}$")


class ChatResponse(BaseModel):
    agent: str
    category: str
    response: str
    tool_results: list[Any] = []
    slug: str


class DeployRequest(BaseModel):
    config: Optional[dict[str, Any]] = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _check_deployment_limit(user: User, db: Session) -> None:
    """Raise 403 if the unsubscribed user is already at the deployment limit."""
    if user.subscription_tier in TIER_UNLIMITED:
        return
    count = (
        db.query(ActiveDeployment)
        .filter(
            ActiveDeployment.user_id == user.id,
            ActiveDeployment.status == "active",
        )
        .count()
    )
    if count >= UNSUBSCRIBED_MAX_DEPLOYMENTS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Unsubscribed accounts are limited to {UNSUBSCRIBED_MAX_DEPLOYMENTS} active "
                "deployments. Subscribe to a plan for unlimited deployments."
            ),
        )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get(
    "",
    response_model=list[AgentOut],
    summary="List all active agents, optionally filtered by category",
)
def list_agents(
    category: Optional[str] = Query(None, description="Filter by category slug"),
    db: Session = Depends(get_db),
    _api_key: None = Depends(verify_api_key),
) -> list[AgentOut]:
    q = db.query(AgentCatalog).filter(AgentCatalog.is_active == True)
    if category:
        q = q.filter(AgentCatalog.category == category)
    agents = q.order_by(AgentCatalog.name).all()
    return [AgentOut.from_orm_agent(a) for a in agents]


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Chat with an agent or auto-route to best agent",
)
def chat_with_agent(
    body: ChatRequest,
    _api_key: None = Depends(verify_api_key),
) -> ChatResponse:
    """Send a message to a specific agent (by slug via agent_id) or let the
    intent classifier route to the best matching agent.

    The agent_id can be either:
    - A backend slug (e.g., '311-infrastructure-abatement')
    - A frontend ID (e.g., 'civic-001') — will fall back to intent routing
    """
    result = None

    if body.agent_id:
        # Try direct slug match first
        result = agent_engine.run_agent(body.agent_id, body.message)
        if result.get("error"):
            # Slug not found — fall back to intent routing
            result = None

    if result is None:
        result = agent_engine.route_query(body.message)

    if result.get("error"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"],
        )

    return ChatResponse(
        agent=result["agent"],
        category=result["category"],
        response=result["response"],
        tool_results=result.get("tool_results", []),
        slug=result["slug"],
    )


@router.get(
    "/deployments",
    response_model=list[DeploymentOut],
    summary="List the current user's active deployments",
)
def list_deployments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[DeploymentOut]:
    deployments = (
        db.query(ActiveDeployment)
        .filter(
            ActiveDeployment.user_id == current_user.id,
            ActiveDeployment.status == "active",
        )
        .order_by(ActiveDeployment.deployed_at.desc())
        .all()
    )
    return [
        DeploymentOut(
            id=d.id,
            agent_id=d.agent_id,
            status=d.status,
            deployed_at=d.deployed_at,
            last_active=d.last_active,
            agent=AgentOut.from_orm_agent(d.agent),
            config=d.deployment_config,
        )
        for d in deployments
    ]


@router.get(
    "/{slug}",
    response_model=AgentOut,
    summary="Retrieve a single agent by slug",
)
def get_agent(slug: str, db: Session = Depends(get_db)) -> AgentOut:
    agent = (
        db.query(AgentCatalog)
        .filter(AgentCatalog.slug == slug, AgentCatalog.is_active == True)
        .first()
    )
    if agent is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent {slug!r} not found.",
        )
    return AgentOut.from_orm_agent(agent)


@router.post(
    "/{slug}/deploy",
    response_model=DeploymentOut,
    status_code=status.HTTP_201_CREATED,
    summary="Deploy an agent for the current user",
)
def deploy_agent(
    slug: str,
    body: DeployRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DeploymentOut:
    agent = (
        db.query(AgentCatalog)
        .filter(AgentCatalog.slug == slug, AgentCatalog.is_active == True)
        .first()
    )
    if agent is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent {slug!r} not found.",
        )

    # Check for an existing active deployment of the same agent
    existing = (
        db.query(ActiveDeployment)
        .filter(
            ActiveDeployment.user_id == current_user.id,
            ActiveDeployment.agent_id == agent.id,
            ActiveDeployment.status == "active",
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have an active deployment of this agent.",
        )

    _check_deployment_limit(current_user, db)

    deployment = ActiveDeployment(
        user_id=current_user.id,
        agent_id=agent.id,
        status="active",
        config=json.dumps(body.config or {}),
        deployed_at=datetime.now(timezone.utc),
    )
    db.add(deployment)
    db.commit()
    db.refresh(deployment)

    return DeploymentOut(
        id=deployment.id,
        agent_id=deployment.agent_id,
        status=deployment.status,
        deployed_at=deployment.deployed_at,
        last_active=deployment.last_active,
        agent=AgentOut.from_orm_agent(agent),
        config=deployment.deployment_config,
    )


@router.delete(
    "/deployments/{deployment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove an active deployment",
)
def remove_deployment(
    deployment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    deployment = db.get(ActiveDeployment, deployment_id)
    if deployment is None or deployment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found.",
        )
    deployment.status = "removed"
    db.commit()
