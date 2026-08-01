from fastapi import APIRouter

from app.modules.product_images.dependencies import ProductImageServiceDep
from app.modules.product_images.schemas import ProductImageResponse

router = APIRouter()


@router.get(
    '/{product_id}/images',
    summary='Получить все изображения товара',
    response_model=list[ProductImageResponse]
)
async def get_product_images(
    product_id: int,
        service: ProductImageServiceDep
):
    return await service.get_product_images(
        product_id
    )
