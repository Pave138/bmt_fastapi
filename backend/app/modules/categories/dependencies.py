from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.services.cache.dependencies import RedisDep

from .repositories import CategoryRepository
from .services import CategoryService


async def get_category_repository(
        session: SessionDep
) -> CategoryRepository:
    return CategoryRepository(session)


CategoryRepositoryDep = Annotated[
    CategoryRepository,
    Depends(get_category_repository)
]


async def get_category_service(
    repository: CategoryRepositoryDep,
    redis: RedisDep
) -> CategoryService:
    return CategoryService(
        repository=repository,
        redis=redis
    )


CategoryServiceDep = Annotated[
    CategoryService,
    Depends(get_category_service)
]
