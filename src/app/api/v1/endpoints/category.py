from fastapi import APIRouter, Depends

from app.auth.dependencies import current_superuser
from app.schemas.category import (
    CategoryCreate, CategoryDB
)
from app.services.category import CategoryService
from app.api.deps import get_category_service
from app.models.category import Category

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
        service: CategoryService = Depends(get_category_service)
) -> Category:
    return await service.create_category(data.model_dump())


@router.get(
    '/',
    response_model=list[CategoryDB],
    summary='Получить все категории',
    description='Получает все категории'
)
async def get_categories(
        service: CategoryService = Depends(get_category_service)
):
    return await service.get_categories()
