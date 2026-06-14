from fastapi import APIRouter, File, Query, UploadFile, status

from app.modules.product_images.dependencies import ProductImageServiceDep
from app.modules.product_images.schemas import ProductImageResponse

router = APIRouter()


@ router.post(
    '/{product_id}/images',
    response_model=ProductImageResponse,
    status_code=status.HTTP_201_CREATED
)
async def upload_product_image(
    product_id: int,
    service: ProductImageServiceDep,
    file: UploadFile = File(...),
    is_main: bool = Query(False)
):
    return await service.upload_image(
        product_id=product_id,
        file=file,
        is_main=is_main
    )


@router.get(
    '/{product_id}/images',
    response_model=list[ProductImageResponse]
)
async def get_product_images(
    product_id: int,
        service: ProductImageServiceDep
):
    return await service.get_product_images(
        product_id
    )


@router.patch(
    '/images/{image_id}/set-main',
    response_model=ProductImageResponse
)
async def set_main_image(
    image_id: int,
    service: ProductImageServiceDep
):
    return await service.set_main_image(
        image_id
    )


@router.delete(
    '/images/{image_id}',
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_product_image(
    image_id: int,
    service: ProductImageServiceDep
):
    await service.delete_image(
        image_id
    )
