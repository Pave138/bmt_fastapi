from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.cart_items.repositories import CartItemRepository


def get_cart_item_repository(
    session: SessionDep
) -> CartItemRepository:
    return CartItemRepository(session)


CartItemRepositoryDep = Annotated[
    CartItemRepository,
    Depends(get_cart_item_repository)
]
