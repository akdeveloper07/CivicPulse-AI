import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_router
from app.db.base import Base
from app.db.session import engine
from app.db.seed import seed_database

setup_logging()
logger = logging.getLogger("civicpulse.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifespan context manager."""
    logger.info("Starting up CivicPulse Backend Application...")
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Seed demo synthetic dataset
    try:
        seed_database()
    except Exception as e:
        logger.warning(f"Seed database warning: {e}")
    yield
    logger.info("Shutting down CivicPulse Backend Application.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Explainable AI Platform for Civic Issue Intelligence and Resolution Tracking",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": f"{settings.API_V1_STR}/docs",
        "openapi_url": f"{settings.API_V1_STR}/openapi.json"
    }
