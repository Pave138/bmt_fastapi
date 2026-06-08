from typing import Optional
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import (
    REVIEW_COMMENT_MAX_LENGTH,
    REVIEW_RATING_GE,
    REVIEW_RATING_LE,
)
from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin


class Review(CommonMixin, TimestampMixin, Base):
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey('product.id', ondelete='CASCADE'),
        nullable=False
    )
    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    comment: Mapped[Optional[str]] = mapped_column(
        String(length=REVIEW_COMMENT_MAX_LENGTH),
        nullable=True
    )

    user: Mapped['User'] = relationship(
        'User',
        back_populates='reviews'
    )
    product: Mapped['Product'] = relationship(
        'Product',
        back_populates='reviews'
    )

    __table_args__ = (
        CheckConstraint(
            f'rating BETWEEN {REVIEW_RATING_GE} AND {REVIEW_RATING_LE}',
            name='check_review_rating_range'
        ),
        UniqueConstraint(
            'user_id',
            'product_id',
            name='uq_review_user_product'
        ),
        Index('ix_reviews_product_rating', 'product_id', 'rating'),
    )