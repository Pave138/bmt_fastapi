from typing import List, Optional

from pydantic import BaseModel, ConfigDict, TypeAdapter, Field

from .models import Category


class CategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    parent_id: Optional[int] = None
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
