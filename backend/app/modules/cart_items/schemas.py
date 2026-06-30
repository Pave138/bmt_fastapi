from decimal import Decimal

from pydantic import BaseModel, Field

from app.modules.products.schemas import CartProduct


class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(default=1, gt=0)


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartItemResponse(BaseModel):
    product_id: int
    quantity: int
    subtotal: Decimal
    product: CartProduct
