from __future__ import annotations

"""Agent catalogue and deployment endpoints."""

import json
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.models import ActiveDeployment, AgentCatalog, User
from app.services.stripe_service import TIER_UNLIMITED

router = APIRouter(prefix="/api/agents", tags=["agents"])

FREE_TIER_MAX_DEPLOYMENTS = 2


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


class DeployRequest(BaseModel):
    config: Optional[dict[str, Any]] = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _check_deployment_limit(user: User, db: Session) -> None:
    """Raise 403 if the user is on the free tier and already at the limit."""
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
    if count >= FREE_TIER_MAX_DEPLOYMENTS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Free tier is limited to {FREE_TIER_MAX_DEPLOYMENTS} active "
                "deployments. Upgrade to Pro for unlimited deployments."
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
) -> list[AgentOut]:
    q = db.query(AgentCatalog).filter(AgentCatalog.is_active == True)
    if category:
        q = q.filter(AgentCatalog.category == category)
    agents = q.order_by(AgentCatalog.name).all()
    return [AgentOut.from_orm_agent(a) for a in agents]


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
