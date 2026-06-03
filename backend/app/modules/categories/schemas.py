from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter

from ..products.schemas import ProductResponse
from .models import Category


class CategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None


class CategoryDB(BaseModel):
    id: int
    name: str
    parent_id: Optional[int] = None
    products: List[ProductResponse]

    model_config = ConfigDict(from_attributes=True)


class CategoryResponse(CategoryBase):
    id: int
    children: List['CategoryResponse'] = Field(
        default_factory=list
    )

    model_config = ConfigDict(from_attributes=True)


CategoryResponse.model_rebuild()


def build_category_tree(category: Category) -> CategoryResponse:
    return CategoryResponse(
        id=category.id,
        name=category.name,
        parent_id=category.parent_id,
        children=[
            build_category_tree(child)
            for child in category.children
        ]
    )


categories_list_adapter = TypeAdapter(
    list[CategoryResponse]
)
