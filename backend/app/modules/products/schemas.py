from datetime import datetime as dt
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, TypeAdapter

from app.modules.reviews.schemas import ReviewResponse


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    old_price: Optional[Decimal] = None
    category_id: int
    stock: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
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
