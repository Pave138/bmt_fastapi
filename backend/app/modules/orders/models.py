from decimal import Decimal
from enum import StrEnum
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin


class OrderStatus(StrEnum):
    PENDING = 'pending'
    PAID = 'paid'
    SHIPPED = 'shipped'
    DELIVERED = 'delivered'
    CANCELED = 'canceled'

    @property
    def label(self) -> str:
        return {
            OrderStatus.PENDING: 'В ожидании',
            OrderStatus.PAID: 'Оплачен',
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
        SQLEnum(OrderStatus),
        default=OrderStatus.PENDING,
        nullable=False,
        index=True
    )
    total_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    user: Mapped['User'] = relationship(
        'User',
        back_populates='orders'
    )
    items: Mapped[list['OrderItem']] = relationship(
        'OrderItem',
        back_populates='order',
        cascade='all, delete-orphan',
        passive_deletes=True
    )
