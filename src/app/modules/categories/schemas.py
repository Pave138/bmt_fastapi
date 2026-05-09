from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None


class CategoryDB(CategoryBase):
    id: int
    name: str
    parent_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class CategoryTree(BaseModel):
    id: int
    name: str
    children: Optional[List[CategoryDB]] = []

    model_config = ConfigDict(from_attributes=True)