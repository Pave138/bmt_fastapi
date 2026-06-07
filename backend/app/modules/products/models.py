from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    false,
    text,
    true, UniqueConstraint,
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


class Product(CommonMixin, TimestampMixin, Base):
    name: Mapped[str] = mapped_column(
        String(length=PRODUCT_NAME_MAX_LENGTH),
        nullable=False,
        index=True
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(
        Numeric(PRODUCT_PRICE_PRECISION, PRODUCT_PRICE_SCALE),
        nullable=False,
        index=True
    )
    old_price: Mapped[Optional[Decimal]] = mapped_column(
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
    category: Mapped['Category'] = relationship(
        'Category',
        back_populates='products'
    )
    images: Mapped[list['ProductImage']] = relationship(
        'ProductImage',
        back_populates='product',
        cascade='all, delete-orphan'
    )
    reviews: Mapped[list['Review']] = relationship(
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


class ProductImage(CommonMixin, Base):
    product_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('product.id', ondelete='CASCADE')
    )
    file_key: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    is_main: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default=false(),
        nullable=False
    )
    product: Mapped['Product'] = relationship(
        'Product',
        back_populates='images'
    )

    __table_args__ = (
        Index(
            'ix_product_one_main_image',
            'product_id',
            unique=True,
            postgresql_where=text('is_main = true')
        ),
    )
