from fastapi import APIRouter, Depends, status

from app.modules.auth.dependencies import current_superuser
from app.modules.products.dependencies import ProductServiceDep
from app.modules.products.schemas import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter()


@router.post(
    '/categories/{category_id}/products',
    summary='Создать товар (superuser only)',
    response_model=ProductResponse,
    dependencies=[Depends(current_superuser)]
)
async def create_product(
    category_id: int,
    data: ProductCreate,
    service: ProductServiceDep
) -> ProductResponse:
    return await service.create(category_id, data)


@router.get(
    '/products',
    summary='Получить все товары',
    response_model=list[ProductResponse]
)
async def get_products(
    service: ProductServiceDep,
    limit: int = 10,
    offset: int = 0
) -> list[ProductResponse]:
    return await service.get_all(limit=limit, offset=offset)


@router.get(
    '/products/{product_id}',
    summary='Получить товар по ID',
    response_model=ProductResponse
)
async def get_by_id(
    service: ProductServiceDep,
    product_id: int
) -> ProductResponse:
    return await service.get_by_id(product_id)


@router.patch(
    '/products/{product_id}',
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
    '/products/{product_id}',
    summary='Удалить товар (superuser only)',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(current_superuser)]
)
async def delete_product(product_id: int, service: ProductServiceDep) -> None:
    await service.delete(product_id)
