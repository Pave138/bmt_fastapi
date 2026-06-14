from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import Cart


class CartRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, cart_id: int) -> Cart | None:
        result = await self.session.execute(
            select(Cart).where(
                Cart.id == cart_id
            ).options(selectinload(Cart.items))
        )
        return result.scalar_one_or_none()

    async def get_by_user_id(self, user_id: UUID) -> Cart | None:
        result = await self.session.execute(
            select(Cart).where(
                Cart.user_id == user_id
            ).options(selectinload(Cart.items))
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> Cart:
        cart = Cart(**data)
        self.session.add(cart)
        await self.session.flush()
        return cart

    async def delete(self, cart: Cart) -> None:
        await self.session.delete(cart)
