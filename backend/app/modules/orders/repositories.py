from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import Order


class OrderRepository:

    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

    async def create(
        self,
        user_id: UUID,
        total_price,
        discount_amount,
        coupon_id: int | None = None
    ) -> Order:
        order = Order(
            user_id=user_id,
            total_price=total_price,
            discount_amount=discount_amount,
            coupon_id=coupon_id
        )

        self.session.add(order)
        await self.session.flush()

        return order

    async def get_by_id(
        self,
        order_id: int
    ) -> Order | None:
        result = await self.session.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(
                selectinload(Order.items),
                selectinload(Order.payment),
                selectinload(Order.coupon)
            )
        )
        return result.scalar_one_or_none()

    async def get_by_user_id(
        self,
        user_id: UUID
    ) -> list[Order]:
        result = await self.session.execute(
            select(Order)
            .where(Order.user_id == user_id)
            .options(
                selectinload(Order.items),
                selectinload(Order.payment),
                selectinload(Order.coupon)
            )
            .order_by(Order.created_at.desc())
        )
        return list(result.scalars().all())
