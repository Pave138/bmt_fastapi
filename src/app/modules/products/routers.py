from typing import Optional

from fastapi import APIRouter

from .dependencies import ProductServiceDep
from .models import Product
from .schemas import ProductRead, ProductCreate, ProductUpdate

router = APIRouter()


@router.post(
    '/',
    summary='Создать товар',
    description='Создает новый товар',
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
    description='Получает все товары',
    response_model=list[ProductRead]
)
async def get_all(
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    service: ProductServiceDep
) -> list[Product]:
    if limit and offset:
        return await service.get_all(limit=limit, offset=offset)
    return await service.get_all()
