from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import Product
from ..reviews.models import Review


class ProductRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(
        self,
        limit: int,
        offset: int
    ) -> list[tuple[Product, float, int]]:
        result = await self.session.execute(
            select(
                Product,
                func.coalesce(
                    func.avg(Review.rating),
                    0
                ).label('avg_rating'),
                func.count(Review.id).label('reviews_count')
            )
            .outerjoin(
                Review,
                Product.id == Review.product_id
            )
            .group_by(Product.id)
            .order_by(Product.created_at)
            .offset(offset)
            .limit(limit)
        )
        return result.all()

    async def get_by_id(
            self,
            product_id: int
    ) -> Optional[tuple[Product, float, int]]:
        result = await self.session.execute(
            select(
                Product,

                func.coalesce(
                    func.avg(Review.rating),
                    0
                ).label('avg_rating'),

                func.count(
                    Review.id
                ).label('reviews_count')
            )
            .options(
                selectinload(Product.reviews)
            )
            .outerjoin(
                Review,
                Product.id == Review.product_id
            )
            .where(Product.id == product_id)
            .group_by(Product.id)
        )

        return result.one_or_none()

    async def get_all_by_category_id(
        self,
        category_id: int,
        limit: int,
        offset: int
    ) -> list[Product]:
        result = await self.session.execute(
            select(Product).where(
                Product.category_id == category_id
            ).options(
                selectinload(Product.category)
            ).limit(limit).offset(offset)
        )
        return result.scalars().all()

    async def create(self, data: dict) -> Product:
        product = Product(**data)

        self.session.add(product)

        await self.session.flush()

        return product

    async def delete(self, product: Product):
        await self.session.delete(product)
        await self.session.flush()
        return product

    async def exists(self, product_id: int) -> bool:
        result = await self.session.execute(
            select(Product).where(Product.id == product_id)
        )
        return result.scalar_one_or_none() is not None

    async def get_by_id_for_update(self, product_id: int) -> Optional[Product]:
        result = self.session.execute(
            select(Product).where(
                Product.id == product_id
            ).with_for_update()
        )
        return result.scalar_one_or_none()
