from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserOut, GoogleLoginRequest
from app.services.auth_service import register_user, authenticate_user, authenticate_google_user
from app.api.dependencies import get_current_user
from app.models.entities import User

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """Register a new citizen or administrator user."""
    return register_user(db, user_in)


@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user with email and password and return JWT access token."""
    return authenticate_user(db, login_in)


@router.post("/google", response_model=TokenResponse)
def google_login(google_in: GoogleLoginRequest, db: Session = Depends(get_db)):
    """Real-time Google Sign-In authentication."""
    return authenticate_google_user(db, google_in)


@router.post("/login/oauth", response_model=TokenResponse)
def login_oauth(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """OAuth2 compatible token login for Swagger UI documentation."""
    credentials = UserLogin(email=form_data.username, password=form_data.password)
    return authenticate_user(db, credentials)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Get currently authenticated user info."""
    return UserOut.model_validate(current_user)

