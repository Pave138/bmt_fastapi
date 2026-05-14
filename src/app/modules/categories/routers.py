from fastapi import APIRouter, Depends, status

from app.modules.auth.dependencies import current_superuser
from app.modules.categories.schemas import (
    CategoryCreate, CategoryRead, CategoryUpdate
)
from app.modules.categories.dependencies import CategoryServiceDep
from app.modules.categories.models import Category
from app.modules.products.models import Product
from app.modules.products.schemas import ProductRead

router = APIRouter()


@router.post(
    '/',
    response_model=CategoryRead,
    summary='Создать категорию (superuser only)',
    dependencies=[Depends(current_superuser)]
)
async def create_category(
        data: CategoryCreate,
        service: CategoryServiceDep
) -> Category:
    return await service.create_category(data)


@router.get(
    '/',
    response_model=list[CategoryRead],
    summary='Получить все категории',
)
async def get_categories(service: CategoryServiceDep) -> list[Category]:
    return await service.get_categories()


@router.get(
    '/{category_id}',
    response_model=CategoryRead,
    summary='Получить категорию по ID'
)
async def get_by_id(category_id: int, service: CategoryServiceDep) -> Category:
    return await service.get_by_id(category_id)


@router.patch(
    '/{category_id}',
    response_model=CategoryRead,
    summary='Изменить категорию по ID (superuser only)',
    dependencies=[Depends(current_superuser)]
)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    service: CategoryServiceDep
) -> Category:
    return await service.update(category_id, data)


@router.get(
    '/{category_id}/children',
    response_model=list[CategoryRead],
    summary='Получает подкатегории'
)
async def get_children(
    category_id: int,
    service: CategoryServiceDep
) -> list[Category]:
    return await service.get_children(category_id)


@router.delete(
    '/{category_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='Удалить категорию по ID (superuser only)',
    dependencies=[Depends(current_superuser)]
)
async def delete_category(
    category_id: int,
    service: CategoryServiceDep
) -> None:
    await service.delete(category_id)


@router.get(
    '/{category_id}/products',
    summary='Получить товары по категории',
    response_model=list[ProductRead]
)
async def get_products_by_category(
    category_id: int,
    service: CategoryServiceDep
) -> list[Product]:
    return await service.get_product_by_category(category_id)
