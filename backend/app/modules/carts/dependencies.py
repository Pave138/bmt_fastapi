from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep

from .repositories import CartRepository
from .services import CartService


async def get_cart_repository(
        session: SessionDep
) -> CartRepository:
    return CartRepository(session)


CartRepositoryDep = Annotated[
    CartRepository,
    Depends(get_cart_repository)
]


async def get_cart_service(
        repository: CartRepositoryDep
) -> CartService:
    return CartService(repository)


CartServiceDep = Annotated[
    CartService,
    Depends(get_cart_service)
]