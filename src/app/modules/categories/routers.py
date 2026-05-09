from fastapi import APIRouter, Depends

from app.modules.auth.dependencies import current_superuser
from app.modules.categories.schemas import (
    CategoryCreate, CategoryDB
)
from app.modules.categories.dependencies import CategoryServiceDep
from app.modules.categories.models import Category

router = APIRouter()


@router.post(
    '/',
    response_model=CategoryDB,
    summary='Создать категорию',
    description='Создает новую категорию',
    dependencies=[Depends(current_superuser)]
)
async def create_category(
        data: CategoryCreate,
        service: CategoryServiceDep
) -> Category:
    return await service.create_category(data.model_dump())


@router.get(
    '/',
    response_model=list[CategoryDB],
    summary='Получить все категории',
    description='Получает все категории'
)
async def get_categories(service: CategoryServiceDep) -> list[Category]:
    return await service.get_categories()
