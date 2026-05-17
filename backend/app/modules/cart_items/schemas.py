from datetime import datetime as dt

from pydantic import BaseModel, ConfigDict, Field


class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(default=1, gt=0)


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartItemResponse(CartItemBase):
    id: int
    cart_id: int
    created_at: dt
    updated_at: dt

    model_config = ConfigDict(from_attributes=True)