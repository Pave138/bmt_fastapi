from datetime import datetime as dt
from decimal import Decimal
from enum import StrEnum

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Integer,
    Numeric,
    String,
    text,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import CommonMixin


class DiscountType(StrEnum):
    PERCENT = 'percent'
    FIXED = 'fixed'


class Coupon(CommonMixin, Base):
    code: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False,
        index=True
    )
    discount_type: Mapped[DiscountType] = mapped_column(
        SQLEnum(
            DiscountType,
            native_enum=False,
            values_callable=lambda enum: [item.value for item in enum]
        ),
        nullable=False
    )
    value: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        server_default=text('true'),
        nullable=False
    )
    expires_at: Mapped[dt | None] = mapped_column(
        DateTime,
        nullable=True
    )
    usage_limit: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )
    used_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default=text('0'),
        nullable=False
    )
    min_order_amount: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    __table_args__ = (
        CheckConstraint(
            'value > 0',
            name='check_coupon_value_positive'
        ),
        CheckConstraint(
            'used_count >= 0',
            name='check_coupon_used_count_positive'
        ),
        CheckConstraint(
            'usage_limit IS NULL OR usage_limit > 0',
            name='check_coupon_usage_limit_positive'
        ),
        CheckConstraint(
            'min_order_amount IS NULL OR min_order_amount >= 0',
            name='check_coupon_min_order_amount_positive'
        ),
        CheckConstraint(
            """
            (
                discount_type = 'percent'
                AND value <= 100
            )
            OR
            (
                discount_type = 'fixed'
            )
            """,
            name='check_coupon_percent_max'
        )
    )
