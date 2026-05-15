from __future__ import annotations

import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.core.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.core.database import get_db
from app.models.models import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ── Brute force protection ────────────────────────────────────────────────
# Simple in-memory rate limiter for login attempts. Tracks failed attempts
# per email and locks out after MAX_ATTEMPTS within the WINDOW.
_MAX_LOGIN_ATTEMPTS = 5
_LOGIN_WINDOW_SECONDS = 900  # 15 minutes
_login_attempts: dict[str, list[float]] = {}


def _check_login_rate_limit(email: str) -> None:
    """Raise 429 if the email has exceeded the max login attempts."""
    import time
    now = time.time()
    cutoff = now - _LOGIN_WINDOW_SECONDS

    attempts = _login_attempts.get(email, [])
    # Prune old attempts
    attempts = [t for t in attempts if t > cutoff]
    _login_attempts[email] = attempts

    if len(attempts) >= _MAX_LOGIN_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again in 15 minutes.",
        )


def _record_failed_login(email: str) -> None:
    """Record a failed login attempt."""
    import time
    _login_attempts.setdefault(email, []).append(time.time())


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    subscription_tier: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Resolve forward reference
TokenResponse.model_rebuild()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def register(body: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """Create a new account and return an access token immediately."""
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with that email already exists.",
        )

    user = User(
        name=body.name,
        email=body.email,
        hashed_password=hash_password(body.password),
        subscription_tier="unsubscribed",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserOut.model_validate(user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and obtain a JWT",
)
def login(body: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """Validate credentials and return an access token."""
    email_str = str(body.email).lower()
    _check_login_rate_limit(email_str)

    user = db.query(User).filter(User.email == body.email).first()
    if user is None or not verify_password(body.password, user.hashed_password):
        _record_failed_login(email_str)
        logger.warning("Failed login attempt for %s", email_str)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Clear failed attempts on successful login
    _login_attempts.pop(email_str, None)

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserOut.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserOut,
    summary="Return the authenticated user's profile",
)
def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)
