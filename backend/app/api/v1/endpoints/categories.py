from fastapi import APIRouter, Depends, status

from app.core.constants import LIMIT_PRODUCTS, OFFSET_PRODUCTS
from app.modules.auth.dependencies import current_superuser
from app.modules.categories.dependencies import CategoryServiceDep
from app.modules.categories.schemas import (
    CategoryCreate,
    CategoryDB,
    CategoryResponse,
    CategoryUpdate,
)
from app.modules.products.schemas import ProductListResponse

router = APIRouter()


@router.post(
    '/',
    response_model=CategoryDB,
    summary='Создать категорию (superuser only)',
    dependencies=[Depends(current_superuser)]
)
async def create_category(
        data: CategoryCreate,
        service: CategoryServiceDep
) -> CategoryDB:
    return await service.create_category(data)


@router.get(
    '/',
    response_model=list[CategoryResponse],
    summary='Получить все категории'
)
async def get_categories(
    service: CategoryServiceDep
) -> list[CategoryResponse]:
    return await service.get_categories()


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
    response_model=list[ProductListResponse],
    summary='Получить список товаров категории'
)
async def get_category_products(
    category_id: int,
    service: CategoryServiceDep,
    limit: int = LIMIT_PRODUCTS,
    offset: int = OFFSET_PRODUCTS
) -> list[ProductListResponse]:
    return await service.get_category_products_by_id(
        category_id=category_id,
        limit=limit,
        offset=offset
    )
