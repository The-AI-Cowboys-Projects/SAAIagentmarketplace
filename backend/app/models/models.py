from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(
        String(320), unique=True, index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    subscription_tier: Mapped[str] = mapped_column(
        String(50), nullable=False, default="unsubscribed"
    )
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(
        String(255), unique=True, nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )

    # Relationships
    subscriptions: Mapped[list["Subscription"]] = relationship(
        "Subscription", back_populates="user", cascade="all, delete-orphan"
    )
    deployments: Mapped[list["ActiveDeployment"]] = relationship(
        "ActiveDeployment", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"


# ---------------------------------------------------------------------------
# Subscription
# ---------------------------------------------------------------------------


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(
        String(255), unique=True, nullable=True
    )
    tier: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="active"
    )
    price_cents: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    canceled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="subscriptions")

    def __repr__(self) -> str:
        return f"<Subscription id={self.id} tier={self.tier!r} status={self.status!r}>"


# ---------------------------------------------------------------------------
# AgentCatalog
# ---------------------------------------------------------------------------


class AgentCatalog(Base):
    __tablename__ = "agent_catalog"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    # JSON-serialised list/dict of tool configs
    tools_config: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )

    # Relationships
    deployments: Mapped[list["ActiveDeployment"]] = relationship(
        "ActiveDeployment", back_populates="agent", cascade="all, delete-orphan"
    )

    @property
    def tools(self) -> Any:
        """Deserialise tools_config JSON, returning an empty list on failure."""
        if not self.tools_config:
            return []
        try:
            return json.loads(self.tools_config)
        except (json.JSONDecodeError, TypeError):
            return []

    def __repr__(self) -> str:
        return f"<AgentCatalog id={self.id} slug={self.slug!r}>"


# ---------------------------------------------------------------------------
# ActiveDeployment
# ---------------------------------------------------------------------------


class ActiveDeployment(Base):
    __tablename__ = "active_deployments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    agent_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("agent_catalog.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="active"
    )
    # JSON-serialised deployment overrides / parameters
    config: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    deployed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    last_active: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="deployments")
    agent: Mapped["AgentCatalog"] = relationship(
        "AgentCatalog", back_populates="deployments"
    )

    @property
    def deployment_config(self) -> Any:
        """Deserialise config JSON, returning an empty dict on failure."""
        if not self.config:
            return {}
        try:
            return json.loads(self.config)
        except (json.JSONDecodeError, TypeError):
            return {}

    def __repr__(self) -> str:
        return (
            f"<ActiveDeployment id={self.id} user_id={self.user_id}"
            f" agent_id={self.agent_id} status={self.status!r}>"
        )


# ---------------------------------------------------------------------------
# Lead
# ---------------------------------------------------------------------------


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    organization: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_size: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    use_case: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    search_keywords: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # Scoring output
    score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    priority: Mapped[str] = mapped_column(
        String(20), nullable=False, default="low"
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="new", index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )

    def __repr__(self) -> str:
        return (
            f"<Lead id={self.id} email={self.email!r}"
            f" priority={self.priority!r} score={self.score}>"
        )
