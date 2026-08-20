from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.product_images.models import ProductImage
from app.modules.products.models import Product
from app.modules.products.repositories import ProductRepository

from .models import Favorite


class FavoriteRepository:

    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

    async def create(
        self,
        user_id: UUID,
        product_id: int
    ) -> None:

        favorite = Favorite(
            user_id=user_id,
            product_id=product_id
        )

        self.session.add(favorite)
        await self.session.flush()

    async def get(
        self,
        user_id: UUID,
        product_id: int
    ) -> Favorite | None:
        result = await self.session.execute(
            select(Favorite)
            .where(
                Favorite.user_id == user_id,
                Favorite.product_id == product_id
            )
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        user_id: UUID,
        offset: int,
        limit: int
    ) -> list[
        tuple[
            Product,
            ProductImage | None,
            float,
            int
        ]
    ]:
        result = await self.session.execute(
            ProductRepository.build_products_with_stats_query()
            .join(
                Favorite,
                Favorite.product_id == Product.id
            )
            .where(
                Favorite.user_id == user_id
            )
            .offset(offset)
            .limit(limit)
        )

        return result.all()

    async def count_by_user_id(
        self,
        user_id: UUID
    ) -> int:
        result = await self.session.execute(
            select(func.count(Favorite.product_id))
            .where(Favorite.user_id == user_id)
        )
        return result.scalar_one()

    async def delete(
        self,
        favorite: Favorite
    ) -> None:
        await self.session.delete(favorite)
        await self.session.flush()
