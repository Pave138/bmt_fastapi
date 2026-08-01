from fastapi import APIRouter

from app.modules.product_specifications.dependencies import (
    ProductSpecificationServiceDep,
)
from app.modules.product_specifications.schemas import (
    SpecDB,
)

router = APIRouter()


@router.get(
    '/{product_id}',
    response_model=list[SpecDB],
    summary='Получить все характеристики товара'
)
async def get_specs(
    product_id: int,
    service: ProductSpecificationServiceDep
) -> list[SpecDB]:
    return await service.get_by_product_id(product_id)
