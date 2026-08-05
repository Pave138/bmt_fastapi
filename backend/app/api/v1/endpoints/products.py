from fastapi import APIRouter, Query

from app.core.constants import LIMIT_PRODUCTS, OFFSET_PRODUCTS
from app.modules.products.dependencies import ProductServiceDep
from app.modules.products.schemas import ProductListResponse, ProductResponse

router = APIRouter()


@router.get(
    '',
    summary='Получить все товары',
    response_model=list[ProductListResponse]
)
async def get_products(
    service: ProductServiceDep,
    category_id: int | None = Query(
        None,
        description='Товары определенной категории'
    ),
    search: str | None = Query(
        None, 
        description='Поиск по названию товара'
    ),
    limit: int = LIMIT_PRODUCTS,
    offset: int = OFFSET_PRODUCTS
) -> list[ProductListResponse]:
    return await service.get_all(
        category_id=category_id,
        search=search,
        limit=limit,
        offset=offset
    )


@router.get(
    '/{product_id}',
    summary='Получить товар по ID',
    response_model=ProductResponse
)
async def get_by_id(
    service: ProductServiceDep,
    product_id: int
) -> ProductResponse:
    return await service.get_by_id(product_id)
