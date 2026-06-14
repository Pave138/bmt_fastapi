from typing import List

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter

from app.core.constants import CATEGORY_EXAMPLE_NAME, CATEGORY_NAME_MAX_LENGTH
from app.modules.products.schemas import ProductResponse

from .models import Category


class CategoryFields(BaseModel):
    name: str = Field(max_length=CATEGORY_NAME_MAX_LENGTH)
    parent_id: int | None = None


class CategoryCreate(CategoryFields):

    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'name': CATEGORY_EXAMPLE_NAME,
                'parent_id': 1
            }
        }
    )


class CategoryUpdate(BaseModel):
    name: str | None = Field(
        None,
        max_length=CATEGORY_NAME_MAX_LENGTH
    )
    parent_id: int | None = None

    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'name': CATEGORY_EXAMPLE_NAME,
                'parent_id': 1
            }
        }
    )


class CategoryDB(CategoryFields):
    id: int
    name: str
    parent_id: int | None = None
    products: List[ProductResponse]

    model_config = ConfigDict(from_attributes=True)


class CategoryResponse(CategoryFields):
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
