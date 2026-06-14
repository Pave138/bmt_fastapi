from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin

if TYPE_CHECKING:
    from app.db.models import Order, Product


class OrderItem(CommonMixin, TimestampMixin, Base):
    order_id: Mapped[int] = mapped_column(
        ForeignKey('order.id', ondelete='CASCADE'),
        nullable=False
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey('product.id'),
        nullable=False
    )
    price_at_purchase: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )
    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    order: Mapped[Order] = relationship(
        'Order',
        back_populates='items'
    )
    product: Mapped[Product] = relationship(
        'Product'
    )

    __table_args__ = (
        CheckConstraint(
            'quantity > 0',
            name='check_order_item_quantity_positive'
        ),
        Index('ix_order_items_order', 'order_id'),
    )
