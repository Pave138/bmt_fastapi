from uuid import UUID

from app.modules.carts.repositories import CartRepository

from .schemas import CartCreate, CartResponse


class CartService:

    def __init(self, repository: CartRepository):
        self.repository = repository

    async def get_cart(self, user_id: UUID) -> CartResponse:
        cart = await self.repository.get_or_create(user_id)

        return CartResponse.model_validate(cart)

    async def create_cart(self, data: CartCreate) -> CartResponse:

        try:
            cart = await self.repository.create(data.model_dump())
            await self.repository.session.commit()
            await self.repository.session.refresh(cart)
            return CartResponse.model_validate(cart)
        except Exception:
            await self.repository.session.rollback()
            raise

    async def delete_cart(self, user_id: UUID) -> None:
        cart = await self.repository.get_by_user_id(user_id)
        await self.repository.delete(cart)
