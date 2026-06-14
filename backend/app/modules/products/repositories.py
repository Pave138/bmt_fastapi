from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.reviews.models import Review

from .models import Product


class ProductRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _build_products_with_stats_query() -> Select:
        return (
            select(
                Product,
                func.coalesce(
                    func.round(
                        func.avg(Review.rating),
                        1
                    ),
                    0
                ).label('avg_rating'),
                func.count(Review.id).label('reviews_count')
            )
            .outerjoin(
                Review,
                Product.id == Review.product_id
            )
            .group_by(Product.id)
        )

    async def get_all(
        self,
        limit: int,
        offset: int
    ) -> list[tuple[Product, float, int]]:
        result = await self.session.execute(
            self._build_products_with_stats_query()
            .order_by(Product.created_at)
            .offset(offset)
            .limit(limit)
        )
        return result.all()

    async def get_by_id(
            self,
            product_id: int
    ) -> Product | None:
        result = await self.session.execute(
            select(Product)
            .where(
                Product.id == product_id
            )
        )
        return result.scalar_one_or_none()

    async def get_by_id_with_reviews(
        self,
        product_id: int
    ) -> Product | None:
        result = await self.session.execute(
            select(Product)
            .where(Product.id == product_id)
            .options(
                selectinload(Product.reviews)
            )
        )
        return result.scalar_one_or_none()

    async def get_by_id_with_reviews_and_stats(
            self,
            product_id: int
    ) -> tuple[Product, float, int] | None:
        result = await self.session.execute(
            select(
                Product,

                func.coalesce(
                    func.round(
                        func.avg(Review.rating),
                        2
                    ),
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
    ) -> list[tuple[Product, float, int]]:
        result = await self.session.execute(
            self._build_products_with_stats_query()
            .where(Product.category_id == category_id)
            .options(
                selectinload(Product.category)
            ).limit(limit).offset(offset)
        )
        return result.all()

    async def create(self, data: dict) -> Product:
        product = Product(**data)

        self.session.add(product)

        await self.session.flush()

        return product

    async def delete(self, product: Product) -> None:
        await self.session.delete(product)
        await self.session.flush()

    async def exists_by_id(self, product_id: int) -> bool:
        result = await self.session.execute(
            select(Product).where(Product.id == product_id)
        )
        return result.scalar_one_or_none() is not None

    async def get_by_id_for_update(self, product_id: int) -> Product | None:
        result = await self.session.execute(
            select(Product).where(
                Product.id == product_id
            ).with_for_update()
        )
        return result.scalar_one_or_none()
