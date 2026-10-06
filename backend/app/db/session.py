import logging
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("civicpulse.db")

# Determine engine & session maker with PostgreSQL support and SQLite fallback
def get_engine():
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("postgresql"):
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                echo=False,
                connect_args={"connect_timeout": 3}
            )
            # Test quick connection
            with engine.connect() as conn:
                pass
            logger.info("Successfully connected to PostgreSQL database.")
            return engine
    except Exception as e:
        logger.warning(f"Failed to connect to PostgreSQL ({e}). Falling back to local SQLite database.")

    # SQLite fallback mode
    sqlite_url = f"sqlite:///./{settings.SQLITE_FALLBACK_PATH}"
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
        echo=False
    )
    logger.info(f"Using SQLite database at {sqlite_url}")
    return engine


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency for providing a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
