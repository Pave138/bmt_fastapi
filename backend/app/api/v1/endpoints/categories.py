from fastapi import APIRouter, Depends, status

from app.modules.auth.dependencies import current_superuser
from app.modules.categories.dependencies import CategoryServiceDep
from app.modules.categories.models import Category
from app.modules.categories.schemas import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
)
from app.modules.products.models import Product
from app.modules.products.schemas import ProductResponse

router = APIRouter()


@router.post(
    '/',
    response_model=CategoryResponse,
    summary='Создать категорию (superuser only)',
    dependencies=[Depends(current_superuser)]
)
async def create_category(
        data: CategoryCreate,
        service: CategoryServiceDep
) -> CategoryResponse:
    return await service.create_category(data)


@router.get(
    '/',
    response_model=list[CategoryResponse],
    summary='Получить все категории',
)
async def get_categories(
    service: CategoryServiceDep
) -> list[CategoryResponse]:
    return await service.get_categories()


@router.get(
    '/{category_id}',
    response_model=CategoryResponse,
    summary='Получить категорию по ID'
)
async def get_by_id(
    category_id: int,
    service: CategoryServiceDep
) -> CategoryResponse:
    return await service.get_by_id(category_id)


@router.patch(
    '/{category_id}',
    response_model=CategoryResponse,
    summary='Изменить категорию по ID (superuser only)',
    dependencies=[Depends(current_superuser)]
)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    service: CategoryServiceDep
) -> CategoryResponse:
    return await service.update(category_id, data)


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
    response_model=list[ProductResponse]
)
async def get_products_by_category(
    category_id: int,
    service: CategoryServiceDep
) -> list[Product]:
    return await service.get_product_by_category(category_id)
