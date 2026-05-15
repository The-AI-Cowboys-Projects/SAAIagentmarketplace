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

    # JWT — no insecure default; must be set explicitly in all environments
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 24 hours (use refresh tokens for longer sessions)

    # App
    APP_ENV: str = "development"
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    BACKEND_API_KEY: str = ""

    # Seeding
    SEED_AGENTS_ON_STARTUP: bool = True

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def is_development(self) -> bool:
        return self.APP_ENV == "development"


settings = Settings()

# ── Safety checks ─────────────────────────────────────────────────────────
# Fail fast at import time so misconfigured deploys don't serve traffic with
# insecure defaults. JWT_SECRET is required in ALL environments (no insecure
# default). Additional checks apply to any non-development environment.
if not settings.JWT_SECRET:
    print(
        "FATAL: JWT_SECRET must be set to a secure random value. "
        "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\"",
        file=sys.stderr,
    )
    sys.exit(1)

if not settings.is_development:
    if not settings.BACKEND_API_KEY:
        print("FATAL: BACKEND_API_KEY must be set in non-development environments.", file=sys.stderr)
        sys.exit(1)
    if "sqlite" in settings.DATABASE_URL.lower():
        print("FATAL: SQLite is not supported outside development. Set DATABASE_URL to a Postgres connection string.", file=sys.stderr)
        sys.exit(1)
