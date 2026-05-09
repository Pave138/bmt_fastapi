from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep

from .repositories import CategoryRepository
from .services import CategoryService


async def get_category_service(
    session: SessionDep
) -> CategoryService:
    repository = CategoryRepository(session)
    return CategoryService(repository)


CategoryServiceDep = Annotated[
    CategoryService,
    Depends(get_category_service)
]
