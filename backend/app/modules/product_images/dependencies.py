from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.products.dependencies import ProductRepositoryDep
from app.services.minio import MinioServiceDep

from .repositories import ProductImageRepository
from .services import ProductImageService


def get_product_image_repository(
    session: SessionDep
) -> ProductImageRepository:
    return ProductImageRepository(session)


ProductImageRepositoryDep = Annotated[
    ProductImageRepository,
    Depends(get_product_image_repository)
]


def get_product_image_service(
        product_repository: ProductRepositoryDep,
        image_repository: ProductImageRepositoryDep,
        minio_service: MinioServiceDep
) -> ProductImageService:
    return ProductImageService(
        product_repository=product_repository,
        image_repository=image_repository,
        minio_service=minio_service
    )


ProductImageServiceDep = Annotated[
    ProductImageService,
    Depends(get_product_image_service)
]
