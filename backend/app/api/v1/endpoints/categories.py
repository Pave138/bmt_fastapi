from fastapi import APIRouter

from app.core.constants import LIMIT_PRODUCTS, OFFSET_PRODUCTS
from app.modules.categories.dependencies import CategoryServiceDep
from app.modules.categories.schemas import CategoryResponse
from app.modules.products.schemas import ProductListResponse

router = APIRouter()


@router.get(
    '',
    response_model=list[CategoryResponse],
    summary='Получить все категории'
)
async def get_categories(
    service: CategoryServiceDep
) -> list[CategoryResponse]:
    return await service.get_categories()


@router.get(
    '/{category_slug}/products',
    response_model=list[ProductListResponse],
    summary='Получить список товаров категории'
)
async def get_category_products(
    category_slug: str,
    service: CategoryServiceDep,
    limit: int = LIMIT_PRODUCTS,
    offset: int = OFFSET_PRODUCTS
) -> list[ProductListResponse]:
    return await service.get_category_products_by_slug(
        category_slug=category_slug,
        limit=limit,
        offset=offset
    )
