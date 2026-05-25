from typing import Annotated

from fastapi import Depends

from app.services.cache.dependencies import RedisDep
from app.db.session import SessionDep
from app.modules.categories.dependencies import CategoryServiceDep

from .repositories import ProductRepository
from .services import ProductService


async def get_product_repository(session: SessionDep) -> ProductRepository:
    return ProductRepository(session)


ProductRepositoryDep = Annotated[
    ProductRepository,
    Depends(get_product_repository)
]


async def get_product_service(
    repository: ProductRepositoryDep,
    category_service: CategoryServiceDep,
    redis: RedisDep
) -> ProductService:
    return ProductService(
        repository=repository,
        category_service=category_service,
        redis=redis
    )


ProductServiceDep = Annotated[
    ProductService,
    Depends(get_product_service)
]
