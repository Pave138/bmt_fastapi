from fastapi import APIRouter, Query, status

from app.modules.auth.dependencies import CurrentUserDep
from app.modules.favorites.dependencies import FavoriteServiceDep
from app.modules.favorites.schemas import FavoriteListResponse

router = APIRouter()


@router.get(
    '',
    summary='Получить избранные товары',
    response_model=FavoriteListResponse
)
async def get_favorites(
    user: CurrentUserDep,
    service: FavoriteServiceDep,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=10, le=100)

) -> FavoriteListResponse:
    return await service.get_all(
        user_id=user.id,
        offset=offset,
        limit=limit
    )


@router.post(
    '/{product_slug}',
    summary='Добавить в избранное',
    status_code=status.HTTP_204_NO_CONTENT
)
async def create_favorite(
    product_slug: str,
    user: CurrentUserDep,
    service: FavoriteServiceDep
) -> None:
    return await service.create(
        user_id=user.id,
        product_slug=product_slug
    )


@router.delete(
    '/{product_slug}',
    summary='Удалить товар из избранного',
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_favorite(
    product_slug: str,
    user: CurrentUserDep,
    service: FavoriteServiceDep
) -> None:
    await service.delete(
        user_id=user.id,
        product_slug=product_slug
    )
