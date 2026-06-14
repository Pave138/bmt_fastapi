from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.products.models import Product

from ..reviews.models import Review
from .models import Category


class CategoryRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_for_tree(
        self,
    ) -> list[dict]:

        result = await self.session.execute(

            select(
                Category.id,
                Category.name,
                Category.parent_id
            )

        )

        rows = result.all()

        return [
            {
                "id": row.id,
                "name": row.name,
                "parent_id": row.parent_id
            }
            for row in rows
        ]

    async def get_by_id(self, category_id: int) -> Category | None:
        result = await self.session.execute(
            select(Category).where(
                Category.id == category_id
            )
            .options(
                selectinload(Category.products)
                .selectinload(Product.reviews)
            )
        )
        return result.scalar_one_or_none()

    async def exists(self, category_id: int) -> bool:
        result = await self.session.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none() is not None

    async def create(self, data: dict) -> Category:
        category = Category(**data)

        self.session.add(category)
        await self.session.flush()
        return category

    async def delete(self, category: Category) -> None:
        await self.session.delete(category)

    async def get_category_products_by_id(
            self,
            category_id: int,
            limit: int,
            offset: int
    ) -> list[tuple[Product, float, int]]:
        result = await self.session.execute(
            select(
                Product,
                func.coalesce(
                    func.avg(Review.rating),
                    0
                ).label('avg_rating'),
                func.count(Review.id).label('reviews_count')
            )
            .outerjoin(
                Review,
                Product.id == Review.product_id
            )
            .where(Product.category_id == category_id)
            .group_by(Product.id)
            .order_by(Product.created_at)
            .offset(offset)
            .limit(limit)
        )
        return result.all()
