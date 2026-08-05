from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased, selectinload

from app.modules.products.models import Product
from app.modules.reviews.models import Review

from .models import Category


class CategoryRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def descendants_cte(category_id: int):
        category_tree = (
            select(Category.id)
            .where(Category.id == category_id)
            .cte(
                name="category_tree",
                recursive=True,
            )
        )

        category_alias = aliased(Category)

        return category_tree.union_all(
            select(category_alias.id).where(
                category_alias.parent_id == category_tree.c.id
            )
        )

    async def get_descendant_ids(
        self,
        category_id: int,
    ) -> list[int]:
        rows = await self.get_all_for_tree()

        children_map: dict[int | None, list[int]] = {}

        for row in rows:
            children_map.setdefault(
                row['parent_id'],
                []
            ).append(row['id'])

        result: list[int] = []

        def dfs(category: int) -> None:
            result.append(category)

            for child in children_map.get(category, []):
                dfs(child)

        dfs(category_id)

        return result

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
