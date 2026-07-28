from decimal import Decimal

from pydantic import BaseModel

from app.modules.order_items.models import OrderItem
from app.modules.orders.models import OrderStatus


class OrderResponse(BaseModel):
    id: int
    status: OrderStatus
    total_price: Decimal
    items: list[OrderItem]
    coupon_id: int | None
