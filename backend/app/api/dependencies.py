from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User
from app.core.security import decode_access_token
from app.core.permissions import UserRole, check_has_role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """Validate bearer token and retrieve active user from DB."""
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject identifier."
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account does not exist or is inactive."
        )
    return user


def get_current_administrator(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure current user is Administrator or System Admin."""
    if not check_has_role(current_user.role, [UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMIN]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required for this action."
        )
    return current_user


def get_current_system_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure current user is System Administrator."""
    if not check_has_role(current_user.role, [UserRole.SYSTEM_ADMIN]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System Administrator access required for this action."
        )
    return current_user
