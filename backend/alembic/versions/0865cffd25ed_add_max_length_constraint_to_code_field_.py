"""Add max length constraint to code field in Coupon model.

Revision ID: 0865cffd25ed
Revises: 00af18cbf4f6
Create Date: 2026-06-28 23:19:01.320427

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0865cffd25ed'
down_revision: Union[str, Sequence[str], None] = '00af18cbf4f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "coupon",
        "code",
        existing_type=sa.String(),
        type_=sa.String(32),
        existing_nullable=False,
    )

def downgrade():
    op.alter_column(
        "coupon",
        "code",
        existing_type=sa.String(32),
        type_=sa.String(),
        existing_nullable=False,
    )
