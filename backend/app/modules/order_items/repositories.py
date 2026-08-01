from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from .models import OrderItem


class OrderItemRepository:

    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

    async def create(
        self,
        order_id: int,
        product_id: int,
        price_at_purchase: Decimal,
        quantity: int
    ) -> OrderItem:
        item = OrderItem(
            order_id=order_id,
            product_id=product_id,
            price_at_purchase=price_at_purchase,
            quantity=quantity
        )

        self.session.add(item)
        await self.session.flush()
        await self.session.refresh(item)
        return item
