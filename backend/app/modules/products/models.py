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
    true,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin


class Product(CommonMixin, TimestampMixin, Base):
    name: Mapped[str] = mapped_column(
        String(length=255),
        nullable=False,
        index=True
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        index=True
    )
    old_price: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )
    ## sku: Mapped[str] = mapped_column(String, index=True)
    stock: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default='0',
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

    __table_args__ = (
        Index(
            'ix_products_price_active',
            'price',
            'is_active'
        ),
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
