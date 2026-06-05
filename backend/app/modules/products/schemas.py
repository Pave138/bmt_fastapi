from datetime import datetime as dt
from decimal import Decimal
from typing import Optional, Self

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, model_validator

from app.core.constants import (
    DEFAULT_PRODUCT_PRICE,
    DEFAULT_PRODUCT_STOCK,
    PRODUCT_NAME_MAX_LENGTH,
    PRODUCT_PRICE_GT,
    PRODUCT_STOCK_GT,
)
from app.core.exceptions import ValidationException
from app.modules.reviews.schemas import ReviewResponse


class ProductBase(BaseModel):
    name: str = Field(
        max_length=PRODUCT_NAME_MAX_LENGTH,
        title='Название'
    )
    description: Optional[str] = Field(
        None,
        title='Описание'
    )
    price: Decimal = Field(
        gt=PRODUCT_PRICE_GT,
        default=DEFAULT_PRODUCT_PRICE,
        title='Цена'
    )
    old_price: Optional[Decimal] = Field(
        None,
        gt=PRODUCT_PRICE_GT,
        title='Старая цена'
    )
    category_id: int
    stock: int = Field(gt=PRODUCT_STOCK_GT, default=DEFAULT_PRODUCT_STOCK)

    @model_validator(mode='after')
    def old_price_is_higher_price(self) -> Self:
        if (
            self.old_price
            and self.old_price <= self.price
        ):
            raise ValidationException(
                'Старая цена должна быть больше текущей'
            )
        return self




class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        max_length=PRODUCT_NAME_MAX_LENGTH
    )
    description: Optional[str] = None
    price: Optional[Decimal] = Field(
        None,
        gt=PRODUCT_PRICE_GT,
    )
    old_price: Optional[Decimal] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None


class ProductDB(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(ProductDB):
    reviews_count: int
    avg_rating: float


class ProductResponse(ProductListResponse):
    created_at: dt
    updated_at: dt
    reviews: list[ReviewResponse]


products_list_adapter = TypeAdapter(
    list[ProductListResponse]
)


class ProductImageBase(BaseModel):
    product_id: int
    url: str
    is_main: bool = False


class ProductImageCreate(ProductImageBase):
    pass


class ProductImageUpdate(BaseModel):
    url: Optional[str] = None
    is_main: Optional[bool] = None


class ProductImageRead(ProductImageBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
