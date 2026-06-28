from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Coupon


class CouponRepository:

    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

    async def create(self, **data) -> Coupon:
        coupon = Coupon(**data)
        self.session.add(coupon)
        await self.session.flush()
        return coupon


    async def get_all(self) -> list[Coupon]:
        result = await self.session.execute(
            select(Coupon)
        )

        return list(result.scalars().all())


    async def get_by_code(
        self,
        code: str
    ) -> Coupon | None:
        result = await self.session.execute(
            select(Coupon)
            .where(Coupon.code == code)
        )
        return result.scalar_one_or_none()
