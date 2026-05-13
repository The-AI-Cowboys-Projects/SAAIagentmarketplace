from __future__ import annotations

"""Lead capture and management endpoints."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.models import Lead, User
from app.services.lead_scorer import LeadScorer

router = APIRouter(prefix="/api/leads", tags=["leads"])

_scorer = LeadScorer()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class LeadCreateRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    company_size: Optional[str] = None
    industry: Optional[str] = None
    use_case: Optional[str] = None
    search_keywords: Optional[str] = None


class LeadStatusUpdate(BaseModel):
    status: str


class LeadOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    organization: Optional[str]
    company_size: Optional[str]
    industry: Optional[str]
    use_case: Optional[str]
    search_keywords: Optional[str]
    score: int
    priority: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post(
    "",
    response_model=LeadOut,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a new lead (public endpoint)",
)
def create_lead(
    body: LeadCreateRequest,
    db: Session = Depends(get_db),
) -> LeadOut:
    """Public endpoint — no authentication required.

    Scores the lead at submission time using :class:`LeadScorer`.
    """
    result = _scorer.score(
        company_size=body.company_size,
        industry=body.industry,
        use_case=body.use_case,
        search_keywords=body.search_keywords,
        first_name=body.first_name,
        last_name=body.last_name,
        email=str(body.email),
        phone=body.phone,
        organization=body.organization,
    )

    lead = Lead(
        first_name=body.first_name,
        last_name=body.last_name,
        email=str(body.email),
        phone=body.phone,
        organization=body.organization,
        company_size=body.company_size,
        industry=body.industry,
        use_case=body.use_case,
        search_keywords=body.search_keywords,
        score=result.score,
        priority=result.priority,
        status="new",
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return LeadOut.model_validate(lead)


@router.get(
    "",
    response_model=list[LeadOut],
    summary="List all leads (authenticated)",
)
def list_leads(
    _current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[LeadOut]:
    leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
    return [LeadOut.model_validate(l) for l in leads]


@router.get(
    "/{lead_id}",
    response_model=LeadOut,
    summary="Retrieve a single lead by ID (authenticated)",
)
def get_lead(
    lead_id: int,
    _current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LeadOut:
    lead = db.get(Lead, lead_id)
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead {lead_id} not found.",
        )
    return LeadOut.model_validate(lead)


@router.put(
    "/{lead_id}/status",
    response_model=LeadOut,
    summary="Update a lead's status (authenticated)",
)
def update_lead_status(
    lead_id: int,
    body: LeadStatusUpdate,
    _current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LeadOut:
    lead = db.get(Lead, lead_id)
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead {lead_id} not found.",
        )
    lead.status = body.status
    db.commit()
    db.refresh(lead)
    return LeadOut.model_validate(lead)
