import os
from typing import Dict, List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicNexus AI: Civic Intelligence & Issue Resolution Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = Field(default="civicpulse-secret-key-change-in-production-32bytesmin!")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for dev ease

    # Database Configuration (PostgreSQL primary with SQLite fallback for local test flexibility)
    DATABASE_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/civicpulse",
        description="Database connection URL"
    )
    SQLITE_FALLBACK_PATH: str = "civicpulse_dev.db"

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://civicpulse.onrender.com",
        "*"
    ]

    # AI Configuration
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    SIMILARITY_THRESHOLD_DUPLICATE: float = 0.82
    SIMILARITY_THRESHOLD_RELATED: float = 0.65
    SIMILARITY_THRESHOLD_UNCERTAIN_LOW: float = 0.55
    SIMILARITY_THRESHOLD_UNCERTAIN_HIGH: float = 0.85

    # Priority Scoring Configurable Weights
    PRIORITY_WEIGHT_IMPACT: float = 0.35
    PRIORITY_WEIGHT_URGENCY: float = 0.25
    PRIORITY_WEIGHT_RECURRENCE: float = 0.25
    PRIORITY_WEIGHT_AGE: float = 0.15

    # Demo Mode
    DEMO_MODE: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
