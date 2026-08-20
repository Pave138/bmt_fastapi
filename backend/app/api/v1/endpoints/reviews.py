from fastapi import APIRouter, Query, status

from app.modules.auth.dependencies import CurrentUserDep, OptionalUserDep
from app.modules.reviews.dependencies import ReviewServiceDep
from app.modules.reviews.schemas import (
    ReviewCreate,
    ReviewListResponse,
    ReviewResponse,
    ReviewUpdate,
)

product_review_router = APIRouter()
review_router = APIRouter()


@review_router.patch(
    '/{review_id}',
    response_model=ReviewResponse,
    summary='Изменить отзыв'
)
async def update_review(
    review_id: int,
    user: CurrentUserDep,
    data: ReviewUpdate,
    service: ReviewServiceDep
) -> ReviewResponse:
    return await service.update(
        review_id=review_id,
        user=user,
        data=data
    )


@review_router.delete(
    '/{review_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='Удалить отзыв'
)
async def delete_review(
    review_id: int,
    user: CurrentUserDep,
    service: ReviewServiceDep
) -> None:
    await service.delete(
        review_id=review_id,
        user=user
    )


@product_review_router.get(
    '',
    summary='Получить отзывы',
    response_model=ReviewListResponse
)
async def get_product_reviews(
    product_slug: str,
    user: OptionalUserDep,
    service: ReviewServiceDep,
    limit: int = Query(default=20, ge=10, le=100),
    offset: int = Query(default=0, ge=0)
) -> ReviewListResponse:
    return await service.get_by_product_slug(
        product_slug=product_slug,
        user=user,
        offset=offset,
        limit=limit
    )


@product_review_router.post(
    '',
    summary='Создать отзыв',
    response_model=ReviewResponse
)
async def create_product_review(
    product_slug: str,
    user: CurrentUserDep,
    data: ReviewCreate,
    service: ReviewServiceDep
) -> ReviewResponse:
    return await service.create(
        product_slug=product_slug,
        user=user,
        data=data
    )
