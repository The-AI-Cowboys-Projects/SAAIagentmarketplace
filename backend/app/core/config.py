from __future__ import annotations

import sys

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    DATABASE_URL: str = "sqlite:///./marketplace.db"

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRICE_STARTER_MONTHLY: str = ""
    STRIPE_PRICE_STARTER_ANNUAL: str = ""
    STRIPE_PRICE_GROWTH_MONTHLY: str = ""
    STRIPE_PRICE_GROWTH_ANNUAL: str = ""
    STRIPE_PRICE_PARTNER_MONTHLY: str = ""
    STRIPE_PRICE_PARTNER_ANNUAL: str = ""

    # OpenAI
    OPENAI_API_KEY: str = ""

    # JWT
    JWT_SECRET: str = "change-me-before-deploying"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # App
    APP_ENV: str = "development"
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    BACKEND_API_KEY: str = ""

    # Seeding
    SEED_AGENTS_ON_STARTUP: bool = True

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


settings = Settings()

# ── Production safety checks ──────────────────────────────────────────────
# Fail fast at import time so misconfigured production deploys don't serve
# traffic with insecure defaults.
if settings.is_production:
    if settings.JWT_SECRET == "change-me-before-deploying" or not settings.JWT_SECRET:
        print("FATAL: JWT_SECRET must be set to a secure value in production.", file=sys.stderr)
        sys.exit(1)
    if not settings.BACKEND_API_KEY:
        print("FATAL: BACKEND_API_KEY must be set in production.", file=sys.stderr)
        sys.exit(1)
    if "sqlite" in settings.DATABASE_URL.lower():
        print("FATAL: SQLite is not supported in production. Set DATABASE_URL to a Postgres connection string.", file=sys.stderr)
        sys.exit(1)
