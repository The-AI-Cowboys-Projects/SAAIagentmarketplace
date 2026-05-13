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
    "free": {
        "name": "Free",
        "description": "Up to 2 agent deployments, 10 AI generations/day",
        "price_cents": 0,
        "stripe_price_id": None,
        "features": [
            "2 active deployments",
            "10 AI generations / day",
            "Community support",
        ],
        "limits": {
            "max_deployments": 2,
            "daily_generations": 10,
        },
    },
    "pro": {
        "name": "Pro",
        "description": "Unlimited deployments, unlimited AI generations",
        "price_cents": 4900,  # $49/month
        "stripe_price_id": settings.STRIPE_PRICE_PRO_MONTHLY,
        "features": [
            "Unlimited deployments",
            "Unlimited AI generations",
            "Priority support",
            "Advanced analytics",
        ],
        "limits": {
            "max_deployments": None,
            "daily_generations": None,
        },
    },
    "bundle": {
        "name": "Bundle + Admin",
        "description": "Pro features plus admin dashboard and white-labelling",
        "price_cents": 9900,  # $99/month
        "stripe_price_id": settings.STRIPE_PRICE_BUNDLE_ADMIN,
        "features": [
            "Everything in Pro",
            "Admin dashboard",
            "White-label branding",
            "Lead management",
            "SLA support",
        ],
        "limits": {
            "max_deployments": None,
            "daily_generations": None,
        },
    },
    "enterprise": {
        "name": "Enterprise",
        "description": "Custom pricing — contact sales",
        "price_cents": None,
        "stripe_price_id": None,
        "features": [
            "Everything in Bundle",
            "Custom integrations",
            "Dedicated success manager",
            "On-premise option",
        ],
        "limits": {
            "max_deployments": None,
            "daily_generations": None,
        },
    },
}

# Tiers that are treated as unlimited for deployment / generation purposes.
TIER_UNLIMITED: set[str] = {"pro", "bundle", "enterprise"}


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
    success_url: str,
    cancel_url: str,
    db: Session,
) -> stripe.checkout.Session:
    """Create a Stripe Checkout session for the requested *tier*.

    Raises ``ValueError`` if the tier is not purchasable (free or enterprise)
    or if no price ID has been configured for it.
    """
    plan = PLAN_CATALOG.get(tier)
    if plan is None:
        raise ValueError(f"Unknown plan tier: {tier!r}")
    if tier in ("free", "enterprise"):
        raise ValueError(f"Tier {tier!r} is not available via Checkout.")

    price_id: Optional[str] = plan.get("stripe_price_id")
    if not price_id:
        raise ValueError(
            f"No Stripe price ID configured for tier {tier!r}. "
            "Set STRIPE_PRICE_PRO_MONTHLY / STRIPE_PRICE_BUNDLE_ADMIN in .env."
        )

    customer_id = get_or_create_stripe_customer(user, db)

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"user_id": str(user.id), "tier": tier},
        subscription_data={
            "metadata": {"user_id": str(user.id), "tier": tier},
        },
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
        user.subscription_tier = "free"

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
