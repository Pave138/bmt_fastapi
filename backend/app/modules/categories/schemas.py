from typing import List, Optional

from pydantic import BaseModel, ConfigDict, TypeAdapter


class CategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: int
    name: str
    parent_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


categories_list_adapter = TypeAdapter(
    list[CategoryResponse]
)

class CategoryTree(BaseModel):
    id: int
    name: str
    children: Optional[List[CategoryResponse]] = []

    model_config = ConfigDict(from_attributes=True)