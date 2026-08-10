"""Change comment field max length in Review model.

Revision ID: edc1a942aa1a
Revises: 8dc39718062e
Create Date: 2026-08-11 14:09:45.955657

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'edc1a942aa1a'
down_revision: Union[str, Sequence[str], None] = '8dc39718062e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "review",
        "comment",
        existing_type=sa.VARCHAR(),
        type_=sa.VARCHAR(length=1000),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "review",
        "comment",
        existing_type=sa.VARCHAR(length=1000),
        type_=sa.VARCHAR(),
        existing_nullable=True,
    )
