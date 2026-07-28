from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Payment


class PaymentRepository:

    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

    async def create(self, data: dict) -> Payment:
        payment = Payment(**data)

        self.session.add(payment)
        await self.session.flush()
        return payment

    async def get_by_order(self, order_id: int) -> Payment | None:

        result = await self.session.execute(
            select(Payment)
            .where(Payment.order_id == order_id)
        )

        return result.scalar_one_or_none()