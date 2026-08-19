from uuid import UUID

from app.core.constants import PRODUCT_NOT_FOUND_MSG
from app.core.exceptions import NotFoundException, ConflictException
from app.modules.favorites.repositories import FavoriteRepository
from app.modules.favorites.schemas import FavoriteResponse
from app.modules.products.repositories import ProductRepository


class FavoriteService:

    def __init__(
        self,
        repository: FavoriteRepository,
        product_repository: ProductRepository
    ):
        self.repository = repository
        self.product_repository = product_repository

    async def create(
        self,
        user_id: UUID,
        product_slug: str
    ) -> FavoriteResponse:

        product = await self.product_repository.get_by_slug(product_slug)

        if not product:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )
        
        if await self.repository.exists(user_id, product.id):
            raise ConflictException(
                'Товар уже добавлен в избранное.'
            )

        favorite = await self.repository.create(
            user_id=user_id,
            product_id=product.id
        )

        await self.repository.session.commit()

        return FavoriteResponse.model_validate(favorite)