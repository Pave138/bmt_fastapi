from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.favorites.repositories import FavoriteRepository
from app.modules.favorites.services import FavoriteService
from app.modules.products.dependencies import ProductRepositoryDep


def get_favorite_repository(session: SessionDep) -> FavoriteRepository:
    return FavoriteRepository(session)


FavoriteRepositoryDep = Annotated[
    FavoriteRepository,
    Depends(get_favorite_repository)
]


def get_favorite_service(
    repository: FavoriteRepositoryDep,
    product_repository: ProductRepositoryDep
) -> FavoriteService:
    return FavoriteService(repository, product_repository)


FavoriteServiceDep = Annotated[
    FavoriteService,
    Depends(get_favorite_service)
]