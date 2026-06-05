from fastapi import APIRouter, Depends, status

from app.core.constants import LIMIT_PRODUCTS, OFFSET_PRODUCTS
from app.modules.auth.dependencies import current_superuser
from app.modules.products.dependencies import ProductServiceDep
from app.modules.products.schemas import (
    ProductCreate,
    ProductDB,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter()


@router.post(
    '/',
    summary='Создать товар (superuser only)',
    response_model=ProductDB,
    dependencies=[Depends(current_superuser)]
)
async def create_product(
    data: ProductCreate,
    service: ProductServiceDep
) -> ProductResponse:
    return await service.create(data)


@router.get(
    '/',
    summary='Получить все товары',
    response_model=list[ProductListResponse]
)
async def get_products(
    service: ProductServiceDep,
    limit: int = LIMIT_PRODUCTS,
    offset: int = OFFSET_PRODUCTS
) -> list[ProductListResponse]:
    return await service.get_all(limit=limit, offset=offset)


@router.get(
    '/{product_id}',
    summary='Получить товар по ID',
    response_model=ProductResponse
)
async def get_by_id(
    service: ProductServiceDep,
    product_id: int
) -> ProductResponse:
    return await service.get_by_id(product_id)


@router.patch(
    '/{product_id}',
    summary='Изменить товар (superuser only)',
    response_model=ProductResponse,
    dependencies=[Depends(current_superuser)]
)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    service: ProductServiceDep
) -> ProductResponse:
    return await service.update(product_id, data)


@router.delete(
    '/{product_id}',
    summary='Удалить товар (superuser only)',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(current_superuser)]
)
async def delete_product(product_id: int, service: ProductServiceDep) -> None:
    await service.delete(product_id)
