from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import Category


class CategoryRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> list[Category]:
        result = await self.session.execute(select(Category))
        return result.scalars().all()

    async def get_by_id(self, category_id: int) -> Optional[Category]:
        result = await self.session.execute(
            select(Category).where(
                Category.id == category_id
            ).options(
                selectinload(Category.children),
                selectinload(Category.products)
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