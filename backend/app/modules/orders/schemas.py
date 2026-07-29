from decimal import Decimal

from pydantic import BaseModel, ConfigDict, TypeAdapter


from app.modules.order_items.schemas import OrderItemResponse
from app.modules.orders.models import OrderStatus


class OrderDB(BaseModel):
    id: int
    status: OrderStatus
    total_price: Decimal
    # items: list[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(OrderDB):
    coupon_code: str | None = None
    confirmation_url: str | None = None


orders_list_adapter = TypeAdapter(
    list[OrderResponse]
)
