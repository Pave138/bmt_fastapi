from fastapi import APIRouter, Depends, status

from app.modules.auth.dependencies import current_superuser
from app.modules.product_specifications.dependencies import (
    ProductSpecificationServiceDep,
)
from app.modules.product_specifications.schemas import SpecCreate, SpecDB

router = APIRouter()


@router.post(
    '/{product_id}',
    response_model=SpecDB,
    summary='Создать характеристику товара',
    dependencies=[Depends(current_superuser)]
)
async def create_spec(
    product_id: int,
    data: SpecCreate,
    service: ProductSpecificationServiceDep
) -> SpecDB:
    return await service.create(product_id, data)


@router.delete(
    '/{spec_id}',
    summary='Удалить характеристику',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(current_superuser)]
)
async def delete_spec(
    spec_id: int,
    service: ProductSpecificationServiceDep
) -> None:
    await service.delete(spec_id)
