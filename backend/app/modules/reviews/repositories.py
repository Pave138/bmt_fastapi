from sqlalchemy import func, select
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

    async def get_by_product_id(
        self,
        product_id: int,
        offset: int,
        limit: int
    ) -> list[Review]:
        result = await self.session.execute(
            select(Review)
            .where(Review.product_id == product_id)
            .order_by(
                Review.created_at.desc(),
                Review.id.desc())
            .offset(offset)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def count_by_product_id(
        self,
        product_id: int
    ) -> int:
        result = await self.session.execute(
            select(func.count(Review.id))
            .where(Review.product_id == product_id)
        )
        return result.scalar_one()

    async def create(
        self,
        data: dict
    ) -> Review:
        review = Review(**data)

        self.session.add(review)
        await self.session.flush()
        return review

    async def delete(self, review: Review) -> None:
        await self.session.delete(review)

    async def get_by_user_and_product(self, username: str, product_id: int):
        result = await self.session.execute(
            select(Review)
            .where(
                Review.user_username == username,
                Review.product_id == product_id
            )
        )
        return result.scalar_one_or_none()
