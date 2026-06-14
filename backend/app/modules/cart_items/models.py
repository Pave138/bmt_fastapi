from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin

if TYPE_CHECKING:
    from app.db.models import Cart, Product


class CartItem(CommonMixin, TimestampMixin, Base):
    cart_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('cart.id', ondelete='CASCADE')
    )
    product_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('product.id', ondelete='RESTRICT')
    )
    quantity: Mapped[int] = mapped_column(
        Integer,
        default=1,
        server_default='1',
        nullable=False
    )

    cart: Mapped[Cart] = relationship('Cart', back_populates='items')
    product: Mapped[Product] = relationship('Product')

    __table_args__ = (
        Index(
            'ix_cart_product_unique',
            'cart_id',
            'product_id',
            unique=True
        ),
        CheckConstraint(
            'quantity > 0',
            name='ck_cart_item_quantity_positive'
        )
    )