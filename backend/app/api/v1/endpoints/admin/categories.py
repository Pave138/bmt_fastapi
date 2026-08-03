from fastapi import APIRouter, Depends, status

from app.modules.auth.dependencies import current_superuser
from app.modules.categories.dependencies import CategoryServiceDep
from app.modules.categories.schemas import (
    CategoryCreate,
    CategoryDB,
    CategoryResponse,
    CategoryUpdate,
)

router = APIRouter()


@router.post(
    '',
    response_model=CategoryDB,
    summary='Создать категорию',
    dependencies=[Depends(current_superuser)]
)
async def create_category(
    data: CategoryCreate,
    service: CategoryServiceDep
) -> CategoryDB:
    return await service.create_category(data)


@router.patch(
    '/{category_id}',
    response_model=CategoryResponse,
    summary='Изменить категорию по ID',
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
    summary='Удалить категорию по ID',
    dependencies=[Depends(current_superuser)]
)
async def delete_category(
    category_id: int,
    service: CategoryServiceDep
) -> None:
    await service.delete(category_id)
