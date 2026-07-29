from datetime import datetime as dt
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Payment, PaymentMethod


class PaymentRepository:

    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

    async def create(
        self,
        payment_method: PaymentMethod,
        order_id: int,
        amount: Decimal,
        external_payment_id: str | None = None,
        paid_at: dt | None = None
    ) -> Payment:
        payment = Payment(
            payment_method=payment_method,
            order_id=order_id,
            amount=amount,
            external_payment_id=external_payment_id,
            paid_at=paid_at
        )

        self.session.add(payment)
        await self.session.flush()
        return payment

    async def get_by_order(self, order_id: int) -> Payment | None:

        result = await self.session.execute(
            select(Payment)
            .where(Payment.order_id == order_id)
        )

        return result.scalar_one_or_none()