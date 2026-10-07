"""initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-04

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Schema creation is managed automatically by SQLAlchemy Base.metadata.create_all
    pass


def downgrade() -> None:
    pass
