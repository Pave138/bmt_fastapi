from __future__ import annotations

from datetime import datetime as dt
from decimal import Decimal
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import (
    EXTERNAL_PAYMENT_ID_MAX_LENGTH,
    MONEY_PRECISION,
    MONEY_SCALE,
)
from app.db.base import Base
from app.db.mixins import CommonMixin

if TYPE_CHECKING:
    from app.db.models import Order



class PaymentMethod(StrEnum):
    CASH = "cash"
    YOOKASSA = "yookassa"

    @property
    def label(self) -> str:
        return {
            PaymentMethod.CASH: "Наличными",
            PaymentMethod.YOOKASSA: "ЮКасса",
        }[self]


class PaymentStatus(StrEnum):
    PENDING = 'pending'
    SUCCEEDED = 'succeeded'
    CANCELED = 'canceled'
    REFUNDED = 'refunded'

    @property
    def label(self) -> str:
        return {
            PaymentStatus.PENDING: 'Ожидает оплаты',
            PaymentStatus.SUCCEEDED: 'Оплачен',
            PaymentStatus.CANCELED: 'Отменен',
            PaymentStatus.REFUNDED: 'Возвращен'
        }[self]


class Payment(CommonMixin, Base):
    payment_method: Mapped[PaymentMethod] = mapped_column(
        SQLEnum(
            PaymentMethod,
            native_enum=False,
            values_callable=lambda e: [item.value for item in e],
        ),
        nullable=False,
    )

    payment_status: Mapped[PaymentStatus] = mapped_column(
        SQLEnum(
            PaymentStatus,
            native_enum=False,
            values_callable=lambda e: [item.value for item in e],
        ),
        default=PaymentStatus.PENDING,
        server_default=PaymentStatus.PENDING.value,
        nullable=False,
    )

    order_id: Mapped[int] = mapped_column(
        ForeignKey("order.id", ondelete="CASCADE"), nullable=False, unique=True
    )

    order: Mapped[Order] = relationship(
        "Order", back_populates="payment", lazy="selectin"
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(MONEY_PRECISION, MONEY_SCALE), nullable=False
    )

    external_payment_id: Mapped[str | None] = mapped_column(
        String(EXTERNAL_PAYMENT_ID_MAX_LENGTH),
        unique=True,
        index=True,
        nullable=True,
    )

    paid_at: Mapped[dt | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
