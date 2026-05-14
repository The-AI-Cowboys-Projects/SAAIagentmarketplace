from __future__ import annotations

"""Stripe integration for the SA AI Agent Marketplace.

Responsibilities:
- Maintain PLAN_CATALOG with pricing metadata
- Create/retrieve Stripe customers
- Create Stripe Checkout sessions
- Handle subscription webhooks (created, updated, deleted)
- Construct and verify webhook events
"""

from datetime import datetime, timezone
from typing import Any, Optional

import stripe
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.models import Subscription, User

# Initialise the Stripe client with the secret key from settings.
stripe.api_key = settings.STRIPE_SECRET_KEY

# ---------------------------------------------------------------------------
# Plan catalogue
# ---------------------------------------------------------------------------

PLAN_CATALOG: dict[str, dict[str, Any]] = {
    "starter": {
        "name": "Starter",
        "description": "All 70 SA agents, 1,000 requests/mo, real-time data",
        "price_cents": 4900,  # $49/month
        "stripe_monthly_price_id": settings.STRIPE_PRICE_STARTER_MONTHLY,
        "stripe_annual_price_id": settings.STRIPE_PRICE_STARTER_ANNUAL,
        "features": [
            "All 70 SA agents",
            "1,000 requests per month",
            "Real-time SA data connections",
            "Browser-based access",
            "Email support",
        ],
        "limits": {
            "max_requests_per_month": 1000,
            "max_team_seats": 1,
        },
    },
    "growth": {
        "name": "Growth",
        "description": "All 70 agents, 10,000 requests/mo, team seats, analytics",
        "price_cents": 14900,  # $149/month
        "stripe_monthly_price_id": settings.STRIPE_PRICE_GROWTH_MONTHLY,
        "stripe_annual_price_id": settings.STRIPE_PRICE_GROWTH_ANNUAL,
        "features": [
            "All 70 agents unlocked",
            "10,000 requests per month",
            "Team seats (up to 5 users)",
            "Priority support",
            "Usage analytics dashboard",
        ],
        "limits": {
            "max_requests_per_month": 10000,
            "max_team_seats": 5,
        },
    },
    "partner": {
        "name": "Partner",
        "description": "Unlimited seats and requests, SSO, SLA, dedicated support",
        "price_cents": 49900,  # $499/month
        "stripe_monthly_price_id": settings.STRIPE_PRICE_PARTNER_MONTHLY,
        "stripe_annual_price_id": settings.STRIPE_PRICE_PARTNER_ANNUAL,
        "features": [
            "All 70 agents, unlimited seats",
            "Unlimited requests",
            "Dedicated account manager",
            "SSO / SAML authentication",
            "Custom data integrations",
            "SLA-backed uptime guarantee",
        ],
        "limits": {
            "max_requests_per_month": None,
            "max_team_seats": None,
        },
    },
}

# Tiers that are treated as unlimited for deployment / generation purposes.
# Any subscribed user is unlimited; only unsubscribed users have limits.
TIER_UNLIMITED: set[str] = {"starter", "growth", "partner"}


# ---------------------------------------------------------------------------
# Customer helpers
# ---------------------------------------------------------------------------


def get_or_create_stripe_customer(user: User, db: Session) -> str:
    """Return the Stripe customer ID for *user*, creating one if needed.

    Persists the new customer ID back to the database before returning.
    """
    if user.stripe_customer_id:
        return user.stripe_customer_id

    customer = stripe.Customer.create(
        email=user.email,
        name=user.name,
        metadata={"user_id": str(user.id)},
    )
    user.stripe_customer_id = customer.id
    db.add(user)
    db.commit()
    db.refresh(user)
    return customer.id


# ---------------------------------------------------------------------------
# Checkout session
# ---------------------------------------------------------------------------


def create_checkout_session(
    *,
    user: User,
    tier: str,
    billing: str = "monthly",
    db: Session,
) -> stripe.checkout.Session:
    """Create a Stripe Checkout session for the requested *tier*.

    Success/cancel URLs are derived server-side from FRONTEND_ORIGIN.
    The *billing* parameter selects monthly vs annual pricing.

    Raises ``ValueError`` if the tier is unknown or unconfigured.
    """
    plan = PLAN_CATALOG.get(tier)
    if plan is None:
        raise ValueError(f"Unknown plan tier: {tier!r}")

    if billing not in ("monthly", "annual"):
        raise ValueError(f"Invalid billing interval: {billing!r}")

    price_key = f"stripe_{billing}_price_id"
    price_id: Optional[str] = plan.get(price_key)
    if not price_id:
        raise ValueError(
            f"No Stripe price ID configured for {tier}/{billing}. "
            f"Set the corresponding STRIPE_PRICE_* env var."
        )

    customer_id = get_or_create_stripe_customer(user, db)

    # URLs are always server-side — never accept from client
    frontend = settings.FRONTEND_ORIGIN.rstrip("/")
    success_url = f"{frontend}/dashboard?checkout=success"
    cancel_url = f"{frontend}/pricing?checkout=cancelled"

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"user_id": str(user.id), "tier": tier, "billing": billing},
        subscription_data={
            "metadata": {"user_id": str(user.id), "tier": tier},
        },
        allow_promotion_codes=True,
    )
    return session


# ---------------------------------------------------------------------------
# Webhook handlers
# ---------------------------------------------------------------------------


def handle_subscription_created_or_updated(
    stripe_subscription: stripe.Subscription,
    db: Session,
) -> None:
    """Upsert a :class:`Subscription` row and update the user's tier.

    Works for both ``customer.subscription.created`` and
    ``customer.subscription.updated`` events.
    """
    meta: dict = dict(stripe_subscription.get("metadata") or {})
    user_id_str: Optional[str] = meta.get("user_id")
    tier: str = meta.get("tier", "pro")

    if not user_id_str:
        # Fall back to looking up via Stripe customer ID
        customer_id = stripe_subscription.get("customer")
        user = (
            db.query(User)
            .filter(User.stripe_customer_id == customer_id)
            .first()
        )
    else:
        user = db.get(User, int(user_id_str))

    if user is None:
        return  # no matching user — nothing to update

    stripe_sub_id: str = stripe_subscription["id"]
    status: str = stripe_subscription.get("status", "active")
    # Price amount in cents from the first item
    try:
        price_cents: int = stripe_subscription["items"]["data"][0]["price"][
            "unit_amount"
        ] or 0
    except (KeyError, IndexError, TypeError):
        price_cents = 0

    # Upsert the local subscription record
    sub = (
        db.query(Subscription)
        .filter(Subscription.stripe_subscription_id == stripe_sub_id)
        .first()
    )
    if sub is None:
        sub = Subscription(
            user_id=user.id,
            stripe_subscription_id=stripe_sub_id,
        )
        db.add(sub)

    sub.tier = tier
    sub.status = status
    sub.price_cents = price_cents

    # Update user tier
    user.subscription_tier = tier

    db.commit()


def handle_subscription_deleted(
    stripe_subscription: stripe.Subscription,
    db: Session,
) -> None:
    """Mark the subscription as cancelled and downgrade the user to free."""
    stripe_sub_id: str = stripe_subscription["id"]
    sub = (
        db.query(Subscription)
        .filter(Subscription.stripe_subscription_id == stripe_sub_id)
        .first()
    )
    if sub is None:
        return

    sub.status = "canceled"
    sub.canceled_at = datetime.now(timezone.utc)

    user = db.get(User, sub.user_id)
    if user:
        user.subscription_tier = "unsubscribed"

    db.commit()


# ---------------------------------------------------------------------------
# Webhook verification
# ---------------------------------------------------------------------------


def construct_webhook_event(payload: bytes, sig_header: str) -> stripe.Event:
    """Verify and construct a Stripe webhook event.

    Raises ``stripe.error.SignatureVerificationError`` on invalid signature.
    """
    return stripe.Webhook.construct_event(
        payload,
        sig_header,
        settings.STRIPE_WEBHOOK_SECRET,
    )
