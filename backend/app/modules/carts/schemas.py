from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

# from app.modules.cart_items.schemas import CartItemResponse


class AddToCart(BaseModel):
    product_id: int
    quantity: int = Field(default=1, gt=0)

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


class CartProduct(BaseModel):
    id: int
    name: str
    price: Decimal

    model_config = ConfigDict(from_attributes=True)


class CartItemResponse(BaseModel):
    product_id: int
    quantity: int
    subtotal: Decimal
    product: CartProduct


class CartResponse(BaseModel):
    id: int
    total_items: int
    total_price: Decimal
    items: list[CartItemResponse]

    model_config = ConfigDict(from_attributes=True)
