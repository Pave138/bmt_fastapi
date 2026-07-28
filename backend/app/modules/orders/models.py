from __future__ import annotations

from decimal import Decimal
from enum import StrEnum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Numeric, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import (
    COUPON_VALUE_PRECISION,
    COUPON_VALUE_SCALE,
    MONEY_PRECISION,
    MONEY_SCALE,
)
from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin

if TYPE_CHECKING:
    from app.db.models import Coupon, OrderItem, Payment, User


class OrderStatus(StrEnum):
    PENDING = 'pending'
    PROCESSING = 'processing'
    SHIPPED = 'shipped'
    DELIVERED = 'delivered'
    CANCELED = 'canceled'

    @property
    def label(self) -> str:
        return {
            OrderStatus.PENDING: 'Создан',
            OrderStatus.PROCESSING: 'Принят в обработку',
            OrderStatus.SHIPPED: 'Отправлен',
            OrderStatus.DELIVERED: 'Доставлен',
            OrderStatus.CANCELED: 'Отменен'
        }[self]


class Order(CommonMixin, TimestampMixin, Base):
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    
    status: Mapped[OrderStatus] = mapped_column(
        SQLEnum(
            OrderStatus,
            native_enum=False,
            values_callable=lambda e: [item.value for item in e]
        ),
        default=OrderStatus.PENDING,
        server_default=OrderStatus.PENDING.value,
        nullable=False,
        index=True
    )
    
    total_price: Mapped[Decimal] = mapped_column(
        Numeric(MONEY_PRECISION, MONEY_SCALE),
        nullable=False
    )

    user: Mapped[User] = relationship(
        'User',
        back_populates='orders'
    )

    items: Mapped[list[OrderItem]] = relationship(
        'OrderItem',
        back_populates='order',
        cascade='all, delete-orphan',
        passive_deletes=True
    )
    
    coupon_id: Mapped[int | None] = mapped_column(
        ForeignKey('coupon.id', ondelete='SET NULL'),
        nullable=True,
        index=True
    )
    
    coupon: Mapped[Coupon | None] = relationship(
        'Coupon',
        back_populates='orders'
    )
    
    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(COUPON_VALUE_PRECISION, COUPON_VALUE_SCALE),
        default=Decimal('0.00'),
        server_default=text('0.00'),
        nullable=False
    )
    
    payment: Mapped[Payment | None] = relationship(
        'Payment',
        back_populates='order',
        cascade='all, delete-orphan',
        uselist=False,
        lazy='selectin'
    )
