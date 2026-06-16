from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.categories.dependencies import CategoryRepositoryDep
from app.modules.product_images.dependencies import ProductImageRepositoryDep
from app.services.cache.dependencies import RedisDep, CacheServiceDep
from app.services.minio import MinioServiceDep

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
    image_repository: ProductImageRepositoryDep,
    minio_service: MinioServiceDep,
    category_repository: CategoryRepositoryDep,
    redis: RedisDep,
    cache_service: CacheServiceDep
) -> ProductService:
    return ProductService(
        repository=repository,
        image_repository=image_repository,
        minio_service=minio_service,
        category_repository=category_repository,
        redis=redis,
        cache_service=cache_service
    )


ProductServiceDep = Annotated[
    ProductService,
    Depends(get_product_service)
]
