from app.modules.categories.repositories import CategoryRepository
from app.core.exceptions import NotFoundException
from .models import Category
from .schemas import CategoryCreate, CategoryUpdate


class CategoryService:

    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def create_category(self, data: CategoryCreate) -> Category:
        return await self.repository.create(data.model_dump())

    async def get_categories(self) -> list[Category]:
        return await self.repository.get_all()

    async def get_by_id(self, category_id: int) -> Category:
        category = await self.repository.get_by_id(category_id)

        if category is None:
            raise NotFoundException(
                'Категория не найдена.'
            )
        return category

    async def update(self, category_id: int, data: CategoryUpdate) -> Category:
        category = await self.get_by_id(category_id)
        update_data = data.model_dump(exclude_unset=True)
        if 'parent_id' in update_data:
            await self.get_by_id(update_data['parent_id'])

        for field, value in update_data.items():
            setattr(category, field, value)

        try:
            await self.repository.session.commit()
            await self.repository.session.refresh(category)
            return category
        except Exception:
            await self.repository.session.rollback()
            raise

    async def get_children(
        self,
        category_id: int
    ) -> list[Category]:
        category = await self.get_by_id(category_id)
        return category.children
