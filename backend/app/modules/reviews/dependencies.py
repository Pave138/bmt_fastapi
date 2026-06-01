from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.services.cache.dependencies import RedisDep
from app.modules.products.dependencies import ProductServiceDep

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
        product_service: ProductServiceDep,
        redis: RedisDep
) -> ReviewService:
    return ReviewService(repository, product_service, redis)


ReviewServiceDep = Annotated[
    ReviewService,
    Depends(get_review_service)
]
