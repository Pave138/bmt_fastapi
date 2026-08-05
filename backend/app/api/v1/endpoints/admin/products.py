from fastapi import APIRouter, Depends, status

from app.modules.auth.dependencies import current_superuser
from app.modules.products.dependencies import ProductServiceDep
from app.modules.products.schemas import ProductCreate, ProductDB, ProductUpdate
from app.services.cache.dependencies import CacheServiceDep

router = APIRouter()


@router.post(
    '/invalidate_product_cache',
    summary='Сброс кэша редис',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(current_superuser)]
)
async def invalidate_product_cache(service: CacheServiceDep) -> None:
    await service.invalidate_product_cache()


@router.post(
    '',
    summary='Создать товар',
    response_model=ProductDB,
    dependencies=[Depends(current_superuser)]
)
async def create_product(
    data: ProductCreate,
    service: ProductServiceDep
) -> ProductDB:
    return await service.create(data)


@router.patch(
    '/{product_id}',
    summary='Изменить товар',
    response_model=ProductDB,
    dependencies=[Depends(current_superuser)]
)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    service: ProductServiceDep
) -> ProductDB:
    return await service.update(product_id, data)


@router.delete(
    '/{product_id}',
    summary='Удалить товар',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(current_superuser)]
)
async def delete_product(product_id: int, service: ProductServiceDep) -> None:
    await service.delete(product_id)
