from __future__ import annotations

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
    STRIPE_PRICE_PRO_MONTHLY: str = ""
    STRIPE_PRICE_BUNDLE_ADMIN: str = ""

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

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


settings = Settings()
