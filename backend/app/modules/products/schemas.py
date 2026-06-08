from datetime import datetime as dt
from decimal import Decimal
from typing import Annotated, Optional, Self

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, model_validator

from app.core.constants import (
    DEFAULT_PRODUCT_STOCK,
    PRODUCT_NAME_MAX_LENGTH,
    PRODUCT_OLD_PRICE_INVALID_MSG,
    PRODUCT_PRICE_GT,
    PRODUCT_PRICE_PRECISION,
    PRODUCT_PRICE_SCALE,
    PRODUCT_STOCK_GE,
)
from app.core.exceptions import ValidationException
from app.modules.reviews.schemas import ReviewResponse

PriceDecimal = Annotated[
    Decimal,
    Field(
        gt=PRODUCT_PRICE_GT,
        decimal_places=PRODUCT_PRICE_SCALE,
        max_digits=PRODUCT_PRICE_PRECISION
    )
]


class ProductFields(BaseModel):
    name: str = Field(
        max_length=PRODUCT_NAME_MAX_LENGTH
    )
    description: Optional[str] = None
    price: PriceDecimal
    old_price: Optional[PriceDecimal]
    category_id: int
    stock: int = Field(ge=PRODUCT_STOCK_GE, default=DEFAULT_PRODUCT_STOCK)


class ProductCreate(ProductFields):

    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'name': 'STIHL MS 462',
                'description': 'Бензопила',
                'price': '149999.99',
                'old_price': '164999.99',
                'category_id': 1,
                'stock': 10
            }
        }
    )

    @model_validator(mode='after')
    def validate_prices(self) -> Self:
        if (
            self.old_price is not None
            and self.old_price <= self.price
        ):
            raise ValidationException(
                PRODUCT_OLD_PRICE_INVALID_MSG
            )
        return self


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        max_length=PRODUCT_NAME_MAX_LENGTH
    )
    description: Optional[str] = None
    price: Optional[PriceDecimal] = None
    old_price: Optional[PriceDecimal] = None
    category_id: Optional[int] = None
    stock: Optional[int] = Field(
        None,
        ge=PRODUCT_STOCK_GE
    )
    is_active: Optional[bool] = None


class ProductDB(ProductFields):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(ProductDB):
    avg_rating: float
    reviews_count: int


class ProductResponse(ProductListResponse):
    created_at: dt
    updated_at: dt
    reviews: list[ReviewResponse] = Field(default_factory=list)


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
