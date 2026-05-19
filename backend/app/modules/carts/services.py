from uuid import UUID

from app.core.exceptions import BadRequestException, NotFoundException
from app.modules.carts.repositories import CartRepository

from .models import Cart
from .schemas import CartCreate


class CartService:

    def __init(self, repository: CartRepository):
        self.repository = repository

    async def get_cart(self, cart_id: int) -> Cart:
        cart = await self.repository.get_by_id(cart_id)

        if not cart:
            raise NotFoundException('Корзина не найдена')
        return cart

    async def get_user_cart(self, user_id: UUID) -> Cart:
        cart = await self.repository.get_by_user_id(user_id)

        if not cart:
            raise NotFoundException('Корзина не найдена')
        return cart

    async def create_cart(self, data: CartCreate):
        if await self.repository.get_by_user_id(data.user_id):
            raise BadRequestException('Корзина существует')

        try:
            cart = await self.repository.create(data.model_dump())
            await self.repository.session.commit()
            await self.repository.session.refresh(cart)
            return cart
        except Exception:
            await self.repository.session.rollback()
            raise

    async def delete_cart(self, cart_id: int) -> None:
        cart = await self.get_cart(cart_id)
        await self.repository.delete(cart)
