from app.modules.categories.repositories import CategoryRepository
from app.modules.products.models import Product
from app.core.exceptions import NotFoundException, ConflictException
from app.core.constants import CATEGORY_NOT_FOUND_MSG
from .models import Category
from .schemas import CategoryCreate, CategoryUpdate


class CategoryService:

    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def create_category(self, data: CategoryCreate) -> Category:
        if data.parent_id:
            if not await self.repository.exists(data.parent_id):
                raise NotFoundException(
                    f'Подкатегория {data.parent_id} не найдена'
                )
        return await self.repository.create(data.model_dump())

    async def get_categories(self) -> list[Category]:
        return await self.repository.get_all()

    async def get_by_id(self, category_id: int) -> Category:
        category = await self.repository.get_by_id(category_id)

        if not category:
            raise NotFoundException(CATEGORY_NOT_FOUND_MSG)
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

    async def delete(self, category_id: int) -> None:
        category = await self.get_by_id(category_id)

        if category.products and len(category.products) > 0:
            products_count = len(category.products)
            raise ConflictException(
                (f'Невозможно удалить категорию {category.name}, так как '
                 f'у нее есть {products_count} связанных товаров.')
            )

        try:
            await self.repository.session.delete(category)
            await self.repository.session.commit()
        except Exception:
            await self.repository.session.rollback()
            raise

    async def get_product_by_category(
        self,
        category_id: int
    ) -> list[Product]:
        category = await self.get_by_id(category_id)
        return category.products
