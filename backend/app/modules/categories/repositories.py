from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..products.models import Product
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

    async def get_by_id(self, category_id: int) -> Optional[Category]:
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