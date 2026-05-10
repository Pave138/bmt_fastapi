from typing import Optional

from fastapi import APIRouter

from .dependencies import ProductServiceDep
from .models import Product
from .services import ProductService
from .schemas import ProductRead, ProductCreate, ProductUpdate
from ..categories.schemas import CategoryCreate

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
    limit: Optional[int],
    offset: Optional[int],
    service: ProductServiceDep
) -> list[Product]:
    return service.get_all()
