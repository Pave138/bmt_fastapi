from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.categories.models import Category


class CategoryRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self):
        result = await self.session.execute(select(Category))
        return result.scalars().all()

    async def get_by_id(self, category_id: int):
        result = await self.session.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict):
        category = Category(**data)

        self.session.add(category)

        await self.session.commit()
        await self.session.refresh(category)

        return category

    async def delete(self, category: Category):
        await self.session.delete(category)
        await self.session.commit()