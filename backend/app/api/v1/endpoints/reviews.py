from fastapi import APIRouter, status

from app.modules.auth.dependencies import CurrentUserDep
from app.modules.reviews.dependencies import ReviewServiceDep
from app.modules.reviews.schemas import (
    ReviewCreate,
    ReviewDB,
    ReviewResponse,
    ReviewUpdate,
)

router = APIRouter()


@router.post(
    '/',
    response_model=ReviewDB,
    summary='Создать отзыв'
)
async def create_review(
    data: ReviewCreate,
    user: CurrentUserDep,
    service: ReviewServiceDep
) -> ReviewResponse:
    return await service.create(
        user=user,
        data=data
    )


@router.patch(
    '/{review_id}',
    response_model=ReviewDB,
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


@router.delete(
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
