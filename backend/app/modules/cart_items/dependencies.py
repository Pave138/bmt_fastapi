from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.cart_items.repositories import CartItemRepository


def get_cart_item_repository(
    session: AsyncSession
) -> CartItemRepository:
    return CartItemRepository(session)


CartItemRepositoryDep = Annotated[
    CartItemRepository,
    Depends(get_cart_item_repository)
]
