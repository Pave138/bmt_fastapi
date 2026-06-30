from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.modules.cart_items.schemas import CartItemResponse
from app.modules.coupons.schemas import CouponCartResponse


class AddToCart(BaseModel):
    product_id: int
    quantity: int = Field(default=1, gt=0)
    coupon_id : int | None = None

    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'product_id': 1,
                'quantity': 1
            }
        }
    )


class UpdateCartItemSchema(BaseModel):
    quantity: int = Field(gt=0)


class CartResponse(BaseModel):
    id: int
    total_items: int
    total_price: Decimal
    coupon: CouponCartResponse | None = None
    items: list[CartItemResponse]

    model_config = ConfigDict(from_attributes=True)


class ApplyCoupon(BaseModel):
    code: str
