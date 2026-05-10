from app.modules.categories.repositories import CategoryRepository
from app.core.exceptions import NotFoundException
from .models import Category
from .schemas import CategoryCreate


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