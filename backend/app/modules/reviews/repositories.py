from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Review


class ReviewRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, review_id: int) -> Review | None:
        result = await self.session.execute(
            select(Review).where(Review.id == review_id)
        )
        return result.scalar_one_or_none()

    async def get_all_by_product_id(self, product_id: int) -> list[Review]:
        result = await self.session.execute(
            select(Review).where(Review.product_id == product_id)
        )
        return result.scalars().all()

    async def create(self, data: dict) -> Review:
        review = Review(**data)

        self.session.add(review)
        await self.session.flush()
        return review

    async def delete(self, review: Review) -> None:
        await self.session.delete(review)
