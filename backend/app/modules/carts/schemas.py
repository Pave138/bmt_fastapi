from pydantic import BaseModel, ConfigDict


class CartBase(BaseModel):
    user_id: int


class CartCreate(CartBase):
    pass


class CartResponse(CartBase):
    id: int
    items: list[CartItemResponse] = []

    model_config = ConfigDict(from_attributes=True)