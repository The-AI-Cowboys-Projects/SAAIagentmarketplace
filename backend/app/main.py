from __future__ import annotations

"""FastAPI application entry point for the SA AI Agent Marketplace backend."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.routers import agents, auth, billing, leads
from app.services.agent_seed import seed_agents
from app.etl.pipeline import run_all_pipelines


# ---------------------------------------------------------------------------
# Lifespan — replaces the deprecated on_startup/on_shutdown hooks
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Create tables and seed the agent catalogue on startup."""
    # Create all tables (no-op if they already exist)
    Base.metadata.create_all(bind=engine)

    # Seed agents
    db = SessionLocal()
    try:
        seed_agents(db)
    finally:
        db.close()

    # Load ETL pipelines (mock data for agent tools)
    try:
        run_all_pipelines()
    except Exception:
        pass  # Non-fatal — agents work without ETL data

    yield
    # Nothing to tear down for SQLite; add cleanup here for production DBs.


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------


def create_app() -> FastAPI:
    app = FastAPI(
        title="SA AI Agent Marketplace API",
        description=(
            "Backend API for the San Antonio AI Agent Marketplace — "
            "browse, deploy, and manage AI agents for your business."
        ),
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS — allow the configured frontend origin plus localhost variants used
    # during development.
    origins = [settings.FRONTEND_ORIGIN]
    if not settings.is_production:
        origins += [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]
    # Always allow the production frontend
    if "sanantonioaiagents.com" not in settings.FRONTEND_ORIGIN:
        origins.append("https://sanantonioaiagents.com")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(auth.router)
    app.include_router(agents.router)
    app.include_router(billing.router)
    app.include_router(leads.router)

    # Health check — no auth required, used by load balancers and uptime monitors
    @app.get("/health", tags=["meta"], summary="Health check")
    async def health() -> dict[str, str]:
        return {"status": "ok", "env": settings.APP_ENV}

    return app


app = create_app()
