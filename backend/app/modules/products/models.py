from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    text,
    true,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import (
    DEFAULT_PRODUCT_STOCK,
    PRODUCT_NAME_MAX_LENGTH,
    PRODUCT_PRICE_PRECISION,
    PRODUCT_PRICE_SCALE,
)
from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin

if TYPE_CHECKING:
    from app.db.models import (
        Category,
        ProductImage,
        ProductSpecification,
        Review,
    )


class Product(CommonMixin, TimestampMixin, Base):
    name: Mapped[str] = mapped_column(
        String(length=PRODUCT_NAME_MAX_LENGTH),
        nullable=False,
        index=True
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    specification: Mapped[list[ProductSpecification]] = relationship(
        'ProductSpecification',
        back_populates='product',
        cascade='all, delete-orphan'
    )
    price: Mapped[Decimal] = mapped_column(
        Numeric(PRODUCT_PRICE_PRECISION, PRODUCT_PRICE_SCALE),
        nullable=False,
        index=True
    )
    old_price: Mapped[Decimal | None] = mapped_column(
        Numeric(PRODUCT_PRICE_PRECISION, PRODUCT_PRICE_SCALE),
        nullable=True
    )
    ## sku: Mapped[str] = mapped_column(String, index=True)
    stock: Mapped[int] = mapped_column(
        Integer,
        default=DEFAULT_PRODUCT_STOCK,
        server_default=text(f'{DEFAULT_PRODUCT_STOCK}'),
        nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        server_default=true(),
        nullable=False,
        index=True
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey('category.id', ondelete='RESTRICT'),
        index=True
    )
    category: Mapped[Category] = relationship(
        'Category',
        back_populates='products'
    )
    images: Mapped[list[ProductImage]] = relationship(
        'ProductImage',
        back_populates='product',
        cascade='all, delete-orphan',
        order_by='ProductImage.is_main.desc()'
    )
    reviews: Mapped[list[Review]] = relationship(
        'Review',
        back_populates='product',
        cascade='all, delete-orphan',
        passive_deletes=True
    )

    __table_args__ = (
        Index(
            'ix_products_price_active',
            'price',
            'is_active'
        ),
        UniqueConstraint(
            'name',
            'category_id',
            name='uq_product_name_category'
        )
    )
