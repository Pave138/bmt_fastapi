from fastapi import APIRouter, Depends, status

from app.modules.auth.dependencies import current_superuser
from app.modules.product_specifications.dependencies import (
    ProductSpecificationServiceDep,
)
from app.modules.product_specifications.schemas import SpecCreate, SpecResponse

router = APIRouter()


@router.post(
    '/{product_id}',
    response_model=SpecResponse,
    summary='Создать характеристику товара (superuser_only)',
    dependencies=[Depends(current_superuser)]
)
async def create_spec(
    product_id: int,
    data: SpecCreate,
    service: ProductSpecificationServiceDep
) -> SpecResponse:
    return await service.create(product_id, data)


@router.get(
    '/{product_id}',
    response_model=list[SpecResponse],
    summary='Получить все характеристики товара'
)
async def get_specs(
    product_id: int,
    service: ProductSpecificationServiceDep
) -> list[SpecResponse]:
    return await service.get_by_product_id(product_id)


@router.delete(
    '/{spec_id}',
    summary='Удалить характеристику (superuser_only)',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(current_superuser)]
)
async def delete_spec(
    spec_id: int,
    service: ProductSpecificationServiceDep
) -> None:
    await service.delete(spec_id)
