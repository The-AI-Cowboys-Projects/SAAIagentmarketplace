from __future__ import annotations

"""Billing and Stripe subscription endpoints."""

import logging
import time
from typing import Any, Optional

logger = logging.getLogger(__name__)

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.models import Subscription, User
from app.services.stripe_service import (
    PLAN_CATALOG,
    construct_webhook_event,
    create_checkout_session,
    handle_subscription_created_or_updated,
    handle_subscription_deleted,
)

router = APIRouter(prefix="/api/billing", tags=["billing"])

# Simple in-memory idempotency cache for webhook events.
# Prevents double-processing if Stripe retries a delivery.
_processed_events: dict[str, float] = {}
_IDEMPOTENCY_TTL = 3600  # 1 hour


def _is_event_processed(event_id: str) -> bool:
    """Return True if this event has already been processed."""
    now = time.time()
    # Prune expired entries periodically
    if len(_processed_events) > 500:
        cutoff = now - _IDEMPOTENCY_TTL
        expired = [k for k, v in _processed_events.items() if v < cutoff]
        for k in expired:
            del _processed_events[k]
    return event_id in _processed_events


def _mark_event_processed(event_id: str) -> None:
    """Record an event ID as processed with the current timestamp."""
    _processed_events[event_id] = time.time()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class PlanOut(BaseModel):
    tier: str
    name: str
    description: str
    price_cents: Optional[int]
    features: list[str]
    limits: dict[str, Any]


class CheckoutRequest(BaseModel):
    tier: str
    billing: str = "monthly"  # "monthly" or "annual"


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str


class SubscriptionOut(BaseModel):
    tier: str
    status: str
    price_cents: int
    stripe_subscription_id: Optional[str]

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get(
    "/plans",
    response_model=list[PlanOut],
    summary="Return all available plans",
)
def list_plans() -> list[PlanOut]:
    return [
        PlanOut(
            tier=tier,
            name=plan["name"],
            description=plan["description"],
            price_cents=plan["price_cents"],
            features=plan["features"],
            limits=plan["limits"],
        )
        for tier, plan in PLAN_CATALOG.items()
    ]


@router.post(
    "/checkout",
    response_model=CheckoutResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Stripe Checkout session for upgrading",
)
def checkout(
    body: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CheckoutResponse:
    try:
        session = create_checkout_session(
            user=current_user,
            tier=body.tier,
            billing=body.billing,
            db=db,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except stripe.StripeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Stripe error: {exc.user_message or str(exc)}",
        ) from exc

    return CheckoutResponse(
        checkout_url=session.url,
        session_id=session.id,
    )


@router.post(
    "/webhook",
    status_code=status.HTTP_200_OK,
    summary="Handle incoming Stripe webhook events",
    include_in_schema=False,  # not exposed in public API docs
)
async def webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="stripe-signature"),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    payload = await request.body()

    if not stripe_signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing Stripe-Signature header.",
        )

    try:
        event = construct_webhook_event(payload, stripe_signature)
    except stripe.SignatureVerificationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Webhook signature verification failed.",
        ) from exc

    event_id: str = event.get("id", "")
    event_type: str = event["type"]

    # Idempotency — skip events we have already processed
    if event_id and _is_event_processed(event_id):
        logger.info("Skipping already-processed webhook event %s", event_id)
        return {"status": "ok"}

    if event_type in (
        "customer.subscription.created",
        "customer.subscription.updated",
    ):
        handle_subscription_created_or_updated(event["data"]["object"], db)

    elif event_type == "customer.subscription.deleted":
        handle_subscription_deleted(event["data"]["object"], db)

    if event_id:
        _mark_event_processed(event_id)

    # Acknowledge all other events silently — Stripe will stop retrying.
    return {"status": "ok"}


@router.get(
    "/subscription",
    response_model=Optional[SubscriptionOut],
    summary="Return the current user's active subscription, if any",
)
def get_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Optional[SubscriptionOut]:
    sub = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == current_user.id,
            Subscription.status == "active",
        )
        .order_by(Subscription.created_at.desc())
        .first()
    )
    if sub is None:
        return None
    return SubscriptionOut.model_validate(sub)
