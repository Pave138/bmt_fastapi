from sqlalchemy import and_, delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import CartItem


class CartItemRepository:
    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

    async def get_by_product(
        self,
        cart_id: int,
        product_id: int
    ) -> CartItem | None:
        result = await self.session.execute(
            select(CartItem)
            .where(
                and_(
                    CartItem.cart_id == cart_id,
                    CartItem.product_id == product_id
                )
            )
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        cart_id: int,
        product_id: int,
        quantity: int
    ) -> CartItem:
        item = CartItem(
            cart_id=cart_id,
            product_id=product_id,
            quantity=quantity
        )

        self.session.add(item)
        await self.session.flush()
        await self.session.refresh(item)
        return item

    async def delete_by_cart_id(
        self,
        cart_id: int
    ) -> None:
        await self.session.execute(
            delete(CartItem)
            .where(CartItem.cart_id == cart_id)
        )

    async def delete_item(
        self,
        cart_item: CartItem
    ) -> None:
        await self.session.delete(cart_item)
