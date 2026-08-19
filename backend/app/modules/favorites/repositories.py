from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

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
    ) -> Favorite:

        favorite = Favorite(
            user_id=user_id,
            product_id=product_id
        )

        self.session.add(favorite)
        await self.session.flush()

        return favorite

    async def exists(
        self,
        user_id: UUID,
        product_id: int
    ) -> bool:
        result = await self.session.execute(
            select(Favorite)
            .where(
                Favorite.user_id == user_id,
                Favorite.product_id == product_id
            )
        )

        return (
            result.scalar_one_or_none()
            is not None
        )
