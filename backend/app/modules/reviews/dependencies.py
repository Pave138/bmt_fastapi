from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.products.dependencies import (
    ProductRepositoryDep,
)
from app.services.cache.dependencies import CacheServiceDep, RedisDep

from .repositories import ReviewRepository
from .services import ReviewService


async def get_review_repository(session: SessionDep) -> ReviewRepository:
    return ReviewRepository(session)


ReviewRepositoryDep = Annotated[
    ReviewRepository,
    Depends(get_review_repository)
]


async def get_review_service(
    repository: ReviewRepositoryDep,
    product_repository: ProductRepositoryDep,
    redis: RedisDep,
    cache_service: CacheServiceDep
) -> ReviewService:
    return ReviewService(
        repository=repository,
        product_repository=product_repository,
        redis=redis,
        cache_service=cache_service
    )


ReviewServiceDep = Annotated[
    ReviewService,
    Depends(get_review_service)
]
