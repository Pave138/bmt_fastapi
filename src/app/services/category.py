from app.repositories.category import CategoryRepository


class CategoryService:

    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def create_category(self, data):
        return await self.repository.create(data)

    async def get_categories(self):
        return await self.repository.get_all()