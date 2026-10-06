from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.entities import User
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserOut
from app.core.security import get_password_hash, verify_password, create_access_token


def register_user(db: Session, user_in: UserRegister) -> UserOut:
    """Register a new citizen or administrator user."""
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Hash password with Argon2id
    hashed_pwd = get_password_hash(user_in.password)

    user = User(
        name=user_in.name.strip(),
        email=user_in.email.lower().strip(),
        password_hash=hashed_pwd,
        role=user_in.role or "citizen"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


def authenticate_user(db: Session, credentials: UserLogin) -> TokenResponse:
    """Authenticate email and password, return JWT token."""
    user = db.query(User).filter(User.email == credentials.email.lower().strip()).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This user account has been deactivated."
        )

    access_token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )


def authenticate_google_user(db: Session, google_data) -> TokenResponse:
    """Authenticate or auto-register user via Google Sign-In."""
    email = google_data.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # Auto-create user for Google Auth
        hashed_pwd = get_password_hash("GoogleOAuthSecuredPass123!")
        user = User(
            name=google_data.name.strip() or email.split("@")[0].capitalize(),
            email=email,
            password_hash=hashed_pwd,
            role="citizen",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This Google-linked account has been deactivated."
        )

    access_token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )

