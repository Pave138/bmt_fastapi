from uuid import UUID

from app.core.constants import PRODUCT_NOT_FOUND_MSG
from app.core.exceptions import ConflictException, NotFoundException
from app.modules.favorites.repositories import FavoriteRepository
from app.modules.favorites.schemas import FavoriteListResponse
from app.modules.product_images.models import ProductImage
from app.modules.product_images.schemas import (
    ProductImageDB,
    ProductImageResponse,
)
from app.modules.products.repositories import ProductRepository
from app.modules.products.schemas import (
    ProductDB,
    ProductListResponse,
)


class FavoriteService:

    def __init__(
        self,
        repository: FavoriteRepository,
        product_repository: ProductRepository
    ):
        self.repository = repository
        self.product_repository = product_repository
        
    def build_image_response(
            self,
            image: ProductImage
    ) -> ProductImageResponse:
        return ProductImageResponse(
            **ProductImageDB.model_validate(
                image
            ).model_dump(),
            image_url=self.minio_service.get_url(
                image.file_key
            )
        )

    async def get_all(
        self,
        user_id: UUID,
        offset: int,
        limit: int
    ) -> FavoriteListResponse:
        products = await self.repository.get_all(
            user_id=user_id,
            offset=offset,
            limit=limit
        )

        items = [
            ProductListResponse(
                **ProductDB.model_validate(
                    product
                ).model_dump(),
                avg_rating=float(avg_rating),
                reviews_count=int(reviews_count),
                main_image=(
                    self.build_image_response(main_image)
                    if main_image
                    else None
                )
            )
            for product, main_image, avg_rating, reviews_count in products
        ]

        total = await self.repository.count_by_user_id(user_id)

        return FavoriteListResponse(
            items=items,
            total=total
        )

    async def create(
        self,
        user_id: UUID,
        product_slug: str
    ) -> None:

        product = await self.product_repository.get_by_slug(product_slug)

        if not product:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )
        
        if await self.repository.get(user_id, product.id):
            raise ConflictException(
                'Товар уже добавлен в избранное.'
            )

        await self.repository.create(
            user_id=user_id,
            product_id=product.id
        )

        await self.repository.session.commit()

    async def delete(
        self,
        user_id: UUID,
        product_slug: str
    ) -> None:
        product = await self.product_repository.get_by_slug(product_slug)

        if not product:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        favorite = await self.repository.get(user_id, product.id)

        if favorite:
            await self.repository.delete(favorite)
            await self.repository.session.commit()
        else:
            raise NotFoundException(
                'Избранное не найдено.'
            )
