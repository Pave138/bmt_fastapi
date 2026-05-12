from fastapi import APIRouter, Depends

from app.modules.auth.dependencies import current_superuser
from app.modules.categories.schemas import (
    CategoryCreate, CategoryRead
)
from app.modules.categories.dependencies import CategoryServiceDep
from app.modules.categories.models import Category

router = APIRouter()


@router.post(
    '/',
    response_model=CategoryRead,
    summary='Создать категорию',
    description='Создает новую категорию',
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
    description='Получает все категории'
)
async def get_all(service: CategoryServiceDep) -> list[Category]:
    return await service.get_categories()


@router.get(
    '/{category_id}',
    response_model=CategoryRead,
    summary='Получить категорию по ID',
    description='Получает категорию по ID'
)
async def get_by_id(service: CategoryServiceDep, category_id: int):
    return await service.get_by_id(category_id)
