from __future__ import annotations

from typing import Generator

from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

# SQLite-specific: allow cross-thread usage and enable WAL mode for
# better concurrent read throughput.
_connect_args: dict = {}
if settings.DATABASE_URL.startswith("sqlite"):
    _connect_args["check_same_thread"] = False

_is_sqlite = settings.DATABASE_URL.startswith("sqlite")

_pool_kwargs: dict = {}
if not _is_sqlite:
    # PostgreSQL pool configuration for production reliability
    _pool_kwargs = {
        "pool_pre_ping": True,      # detect stale connections before use
        "pool_size": 10,             # base pool size
        "max_overflow": 20,          # max connections above pool_size
        "pool_recycle": 3600,        # recycle connections after 1 hour
    }

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=_connect_args,
    echo=settings.APP_ENV == "development",
    **_pool_kwargs,
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragmas(dbapi_conn, _connection_record) -> None:
    """Enable WAL journal mode and foreign keys for every new connection."""
    if settings.DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models."""
    pass


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session and ensures it is
    properly rolled back on error and closed after each request."""
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
