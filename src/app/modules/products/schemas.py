from datetime import datetime as dt
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    old_price: Optional[Decimal] = None
    stock: int
    category_id: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    old_price: Optional[Decimal] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None


class ProductRead(ProductBase):
    id: int
    created_at: dt
    updated_at: dt

    model_config = ConfigDict(from_attributes=True)
