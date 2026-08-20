from pydantic import BaseModel, ConfigDict

from app.modules.products.schemas import (
    ProductFieldsResponse,
    ProductListResponse,
)


class FavoriteResponse(BaseModel):
    product: ProductFieldsResponse

    model_config = ConfigDict(from_attributes=True)


class FavoriteListResponse(BaseModel):
    items: list[ProductListResponse]
    total: int
