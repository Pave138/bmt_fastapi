from typing import Optional
from uuid import UUID

from fastapi_users import schemas


class UserRead(schemas.BaseUser[UUID]):
    username: Optional[str]
    role: str


class UserCreate(schemas.BaseUserCreate):
    username: str
