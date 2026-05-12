from typing import Optional

from fastapi import APIRouter

from .dependencies import ProductServiceDep
from .models import Product
from .schemas import ProductRead, ProductCreate, ProductUpdate

router = APIRouter()


@router.post(
    '/',
    summary='Создать товар',
    response_model=ProductRead
)
async def create(
    data: ProductCreate,
    service: ProductServiceDep
) -> Product:
    return await service.create(data)


@router.get(
    '/',
    summary='Получить все товары',
    response_model=list[ProductRead]
)
async def get_all(
    service: ProductServiceDep,
    limit: int = 10,
    offset: int = 0
) -> list[Product]:
    return await service.get_all(limit=limit, offset=offset)


@router.get(
    '/{product_id}',
    summary='Получить товар по ID',
    response_model=ProductRead
)
async def get_by_id(service: ProductServiceDep, product_id: int) -> Product:
    return await service.get_by_id(product_id)



