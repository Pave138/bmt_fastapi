from fastapi import APIRouter, Depends
from sqlalchemy.sql.functions import current_user

from app.modules.favorites.dependencies import FavoriteServiceDep
from app.modules.favorites.schemas import FavoriteCreate, FavoriteResponse
from app.modules.auth.dependencies import CurrentUserDep

router = APIRouter()


@router.post(
    '/{product_slug}',
    summary='Добавить в избранное',
    response_model=FavoriteResponse
)
async def create_favorite(
    product_slug: str,
    user: CurrentUserDep,
    service: FavoriteServiceDep
) -> FavoriteResponse:
    return await service.create(
        user_id=user.id,
        product_slug=product_slug
    )
