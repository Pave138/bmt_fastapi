from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.cart_items.models import CartItem
from app.modules.coupons.models import Coupon

from .models import Cart


class CartRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_user_id(self, user_id: UUID) -> Cart | None:
        result = await self.session.execute(
            select(Cart)
            .where(Cart.user_id == user_id)
            .options(
                selectinload(Cart.items)
                .selectinload(CartItem.product),
                selectinload(Cart.coupon)
            )
        )
        return result.scalar_one_or_none()

    async def create(self, user_id: UUID) -> Cart:
        cart = Cart(user_id=user_id)
        self.session.add(cart)
        await self.session.flush()
        return await self.get_by_user_id(user_id)

    async def get_or_create(
        self,
        user_id: UUID
    ) -> Cart:
        cart = await self.get_by_user_id(user_id)

        if not cart:
            cart = await self.create(user_id)

        return cart


    async def delete(self, cart: Cart) -> None:
        await self.session.delete(cart)

    async def apply_coupon(
        self,
        cart: Cart,
        coupon: Coupon
    ) -> None:
        cart.coupon = coupon
        await self.session.flush()

