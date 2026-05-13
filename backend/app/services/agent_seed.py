from __future__ import annotations

"""Seed the 50 San Antonio AI agents from the agent catalog.

The on_startup handler in main.py calls ``seed_agents()`` once per
process boot; it is idempotent (uses slug as the unique key, upserts
on conflict).
"""

import json

from sqlalchemy.orm import Session

from app.models.models import AgentCatalog
from app.agents.agent_catalog import AGENT_CATALOG


def seed_agents(db: Session) -> None:
    """Insert or update agents from AGENT_CATALOG.

    Uses the slug as the unique key.  Existing agents are updated in place
    so repeated calls are idempotent.
    """
    for data in AGENT_CATALOG:
        existing = (
            db.query(AgentCatalog)
            .filter(AgentCatalog.slug == data["slug"])
            .first()
        )
        if existing:
            existing.name = data["name"]
            existing.category = data["category"]
            existing.description = data["description"]
            existing.system_prompt = data["system_prompt"]
            existing.tools_config = json.dumps(data.get("tools_config", []))
            existing.icon_name = data.get("icon_name")
            existing.is_active = True
        else:
            agent = AgentCatalog(
                name=data["name"],
                slug=data["slug"],
                category=data["category"],
                description=data["description"],
                system_prompt=data["system_prompt"],
                tools_config=json.dumps(data.get("tools_config", [])),
                icon_name=data.get("icon_name"),
                is_active=True,
            )
            db.add(agent)

    db.commit()
