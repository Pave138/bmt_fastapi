from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.products.repositories import ProductRepository
from app.services.cache.dependencies import RedisDep
from app.services.minio import MinioServiceDep

from .repositories import CategoryRepository
from .services import CategoryService


async def get_product_repository_for_category(
        session: SessionDep
) -> ProductRepository:
    return ProductRepository(session)


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
    product_repository: Annotated[
        ProductRepository,
        Depends(get_product_repository_for_category)
    ],
    minio_service: MinioServiceDep,
    redis: RedisDep
) -> CategoryService:
    return CategoryService(
        repository=repository,
        product_repository=product_repository,
        minio_service=minio_service,
        redis=redis
    )


CategoryServiceDep = Annotated[
    CategoryService,
    Depends(get_category_service)
]
