from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.modules.products.schemas import ProductDB


class OrderItemResponse(BaseModel):
    product: ProductDB
    price_at_purchase: Decimal
    quantity: int

    
    model_config = ConfigDict(from_attributes=True)
