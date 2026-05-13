"""
Database seeder for the 50 San Antonio AI Agent catalog.

Usage:
    python -m app.agents.seed
"""

import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine, Base
from app.models.models import AgentCatalog
from app.agents.agent_catalog import AGENT_CATALOG


def seed_agents(db=None):
    """Insert all 50 agents into the AgentCatalog table."""
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        existing_slugs = {a.slug for a in db.query(AgentCatalog.slug).all()}
        inserted = 0

        for agent_data in AGENT_CATALOG:
            if agent_data["slug"] in existing_slugs:
                continue

            agent = AgentCatalog(
                name=agent_data["name"],
                slug=agent_data["slug"],
                category=agent_data["category"],
                description=agent_data["description"],
                system_prompt=agent_data["system_prompt"],
                tools_config=json.dumps(agent_data["tools_config"]),
                icon_name=agent_data["icon_name"],
                is_active=True,
            )
            db.add(agent)
            inserted += 1

        db.commit()
        print(f"Seeded {inserted} agents ({len(existing_slugs)} already existed)")
        return inserted

    except Exception as e:
        db.rollback()
        print(f"Error seeding agents: {e}")
        raise
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_agents()
