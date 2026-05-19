from decimal import Decimal
from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import CommonMixin, TimestampMixin


class OrderStatus(str, Enum):
    PENDING = ('pending', 'в ожидании')
    PAID = ('paid', 'оплачен')
    SHIPPED = ('shipped', 'отправлен')
    DELIVERED = ('delivered', 'доставлен')
    CANCELED = ('canceled', 'отменен')

    label: str

    def __new__(cls, value: str, label: str):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.label = label
        return obj


class Order(CommonMixin, TimestampMixin, Base):
    user_id: Mapped[int] = mapped_column(
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
