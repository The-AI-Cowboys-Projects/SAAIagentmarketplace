from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt as _bcrypt
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.models import User

# ---------------------------------------------------------------------------
# Password hashing — use bcrypt directly (passlib+bcrypt 4.x incompatible)
# ---------------------------------------------------------------------------


def hash_password(plain: str) -> str:
    """Return the bcrypt hash of *plain*."""
    return _bcrypt.hashpw(plain.encode(), _bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches *hashed*."""
    return _bcrypt.checkpw(plain.encode(), hashed.encode())


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------

_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
_oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login", auto_error=False
)


def create_access_token(subject: str | int) -> str:
    """Create a signed JWT whose *sub* claim is *subject*.

    Expiry is governed by ``settings.JWT_EXPIRE_MINUTES``.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.JWT_EXPIRE_MINUTES
    )
    payload = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT.  Raises ``JWTError`` on failure."""
    return jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM],
    )


# ---------------------------------------------------------------------------
# FastAPI dependencies
# ---------------------------------------------------------------------------


def get_current_user(
    token: str = Depends(_oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Require an authenticated user.  Returns the User ORM instance or
    raises HTTP 401."""
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exc
    except JWTError:
        raise credentials_exc

    user = db.get(User, int(user_id))
    if user is None:
        raise credentials_exc
    return user


def verify_api_key(
    x_api_key: Optional[str] = Header(None, alias="x-api-key"),
) -> None:
    """Verify an API key for service-to-service calls from the Next.js frontend.
    Raises HTTP 401 if the key is missing or invalid."""
    if not settings.BACKEND_API_KEY:
        return  # No key configured — allow all (dev mode)
    if x_api_key != settings.BACKEND_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )


def get_optional_user(
    token: Optional[str] = Depends(_oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Like ``get_current_user`` but returns *None* instead of raising when
    no valid token is present.  Useful for endpoints that serve both
    anonymous and authenticated callers."""
    if not token:
        return None
    try:
        payload = decode_token(token)
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            return None
        return db.get(User, int(user_id))
    except JWTError:
        return None
