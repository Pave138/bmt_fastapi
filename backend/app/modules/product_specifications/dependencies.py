from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.products.dependencies import ProductRepositoryDep
from app.services.cache.dependencies import CacheServiceDep

from .repositories import ProductSpecificationRepository
from .services import ProductSpecificationService


def get_spec_repository(
    session: SessionDep
) -> ProductSpecificationRepository:
    return ProductSpecificationRepository(session)


ProductSpecificationRepositoryDep = Annotated[
    ProductSpecificationRepository,
    Depends(get_spec_repository)
]


def get_spec_service(
    repository: ProductSpecificationRepositoryDep,
    product_repository: ProductRepositoryDep,
    cache_service: CacheServiceDep
) -> ProductSpecificationService:
    return ProductSpecificationService(
        repository=repository,
        product_repository=product_repository,
        cache_service=cache_service
    )


ProductSpecificationServiceDep = Annotated[
    ProductSpecificationService,
    Depends(get_spec_service)
]
