from fastapi import APIRouter

from app.modules.reviews.dependencies import ReviewServiceDep
from app.modules.reviews.schemas import ReviewResponse, ReviewCreate

from app.modules.auth.dependencies import CurrentUserDep

router = APIRouter()


@router.get(
    '/',
    response_model=list[ReviewResponse],
    summary='Получить все отзывы товара по ID'
)
async def get_all_by_product_id(
        product_id: int,
        service: ReviewServiceDep
):
    return await service.get_all_by_product_id(product_id)


@router.post(
    '/',
    response_model=ReviewResponse,
    summary='Создать отзыв'
)
async def create_review(
    product_id: int,
    data: ReviewCreate,
    user: CurrentUserDep,
    service: ReviewServiceDep
):
    return await service.create(
        product_id=product_id,
        user=user,
        data=data
    )


@router.delete(
    '/',
    response_model=ReviewResponse,
    summary='Удалить отзыв'
)
async def delete_review(
    review_id: int,
    user: CurrentUserDep,
    service: ReviewServiceDep
):
    return await service.delete(
        review_id=review_id,
        user=user
    )
