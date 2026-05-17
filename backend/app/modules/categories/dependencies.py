from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep

from .repositories import CategoryRepository
from .services import CategoryService


async def get_category_repository(session: SessionDep):
    return CategoryRepository(session)


CategoryRepositoryDep = Annotated[
    CategoryRepository,
    Depends(get_category_repository)
]


async def get_category_service(
    repository: CategoryRepositoryDep
) -> CategoryService:
    return CategoryService(repository)


CategoryServiceDep = Annotated[
    CategoryService,
    Depends(get_category_service)
]
