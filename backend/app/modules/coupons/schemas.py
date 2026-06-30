from datetime import datetime as dt
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter

from app.core.constants import (
    COUPON_CODE_MAX_LENGTH,
    COUPON_CODE_MIN_LENGTH,
    COUPON_MIN_ORDER_AMOUNT_GT,
    COUPON_MIN_ORDER_AMOUNT_PRECISION,
    COUPON_MIN_ORDER_AMOUNT_SCALE,
    COUPON_USAGE_LIMIT_GT,
    COUPON_VALUE_GT,
    COUPON_VALUE_PRECISION,
    COUPON_VALUE_SCALE,
)

from .models import DiscountType


class CouponFields(BaseModel):
    code: str = Field(
        min_length=COUPON_CODE_MIN_LENGTH,
        max_length=COUPON_CODE_MAX_LENGTH
    )
    discount_type: DiscountType
    value: Decimal = Field(
        gt=COUPON_VALUE_GT,
        decimal_places=COUPON_VALUE_SCALE,
        max_digits=COUPON_VALUE_PRECISION
    )
    is_active: bool = Field(default=True)
    expires_at: dt | None = None
    usage_limit: int | None = Field(
        default=None,
        gt=COUPON_USAGE_LIMIT_GT
    )
    min_order_amount: Decimal | None = Field(
        default=None,
        gt=COUPON_MIN_ORDER_AMOUNT_GT,
        decimal_places=COUPON_MIN_ORDER_AMOUNT_SCALE,
        max_digits=COUPON_MIN_ORDER_AMOUNT_PRECISION
    )


class CouponCreate(CouponFields):
    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'code': 'SALE15',
                'discount_type': DiscountType.PERCENT,
                'value': '15.00',
                'is_active': True,
                'expires_at': None,
                'usage_limit': 100,
                'min_order_amount': '10000.00'
            }
        }
    )


class CouponUpdate(BaseModel):
    code: str | None = Field(
        default=None,
        min_length=COUPON_CODE_MIN_LENGTH,
        max_length=COUPON_CODE_MAX_LENGTH
    )
    discount_type: DiscountType | None = None
    value: Decimal | None = Field(
        default=None,
        gt=COUPON_VALUE_GT,
        decimal_places=COUPON_VALUE_SCALE,
        max_digits=COUPON_VALUE_PRECISION
    )
    is_active: bool | None = None
    expires_at: dt | None = None
    usage_limit: int | None = Field(
        default=None,
        gt=COUPON_USAGE_LIMIT_GT
    )
    min_order_amount: Decimal | None = Field(
        default=None,
        gt=COUPON_MIN_ORDER_AMOUNT_GT,
        decimal_places=COUPON_MIN_ORDER_AMOUNT_SCALE,
        max_digits=COUPON_MIN_ORDER_AMOUNT_PRECISION
    )


class CouponCartResponse(BaseModel):
    code: str
    discount_type: str
    value: Decimal
    min_order_amount: Decimal | None = None

    model_config = ConfigDict(from_attributes=True)


class CouponResponse(CouponFields):
    id: int

    model_config = ConfigDict(from_attributes=True)


CouponResponseListAdapter = TypeAdapter(
    list[CouponResponse]
)
