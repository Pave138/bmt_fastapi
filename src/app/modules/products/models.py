from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, Integer, Numeric, String, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin


class Product(CommonMixin, TimestampMixin, Base):
    name: Mapped[str] = mapped_column(
        String(length=255),
        nullable=False,
        index=True
    )
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        index=True
    )
    old_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )
    ## sku: Mapped[str] = mapped_column(String, index=True)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey('category.id', ondelete='RESTRICT'),
        index=True
    )
    category: Mapped['Category'] = relationship(
        'Category',
        back_populates='products'
    )

    __table_args__ = (
        Index(
            "ix_products_price_active",
            "price",
            "is_active"
        ),
    )
