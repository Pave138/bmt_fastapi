from sqlalchemy import Select, and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased, selectinload

from app.modules.product_images.models import ProductImage
from app.modules.reviews.models import Review

from .models import Product


class ProductRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    @staticmethod
    def _build_products_with_stats_query() -> Select:
        main_image = aliased(ProductImage)

        return (
            select(
                Product,
                main_image,
                func.coalesce(func.round(func.avg(Review.rating), 1), 0).label(
                    "avg_rating"
                ),
                func.count(Review.id).label("reviews_count"),
            )
            .outerjoin(
                main_image,
                and_(
                    main_image.product_id == Product.id,
                    main_image.is_main.is_(True),
                ),
            )
            .outerjoin(Review, Review.product_id == Product.id)
            .group_by(Product.id, main_image.id)
        )

    async def get_all(
        self,
        limit: int,
        offset: int
    ) -> list[tuple[Product, ProductImage | None, float, int]]:
        result = await self.session.execute(
            self._build_products_with_stats_query().offset(offset).limit(limit)
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

    async def get_by_id_with_all(
        self,
        product_id: int
    ) -> tuple[Product| None, float, int]:
        product_result = await self.session.execute(
            select(Product)
            .options(
                selectinload(Product.images), selectinload(Product.reviews)
            )
            .where(Product.id == product_id)
        )

        product = product_result.scalar_one_or_none()

        if product is None:
            return None, 0.0, 0

        stats_result = await self.session.execute(
            select(
                func.coalesce(
                    func.round(
                        func.avg(Review.rating),
                        1
                    ),
                    0
                ).label('avg_rating'),
                func.count(Review.id).label('reviews_count')
            )
            .where(
                Review.product_id == product_id
            )
        )

        avg_rating, reviews_count = stats_result.one()

        return (
            product,
            float(avg_rating),
            reviews_count
        )

    async def get_all_by_category_id(
        self, category_id: int, limit: int, offset: int
    ) -> list[tuple[Product, ProductImage | None, float, int]]:
        result = await self.session.execute(
            self._build_products_with_stats_query()
            .where(Product.category_id == category_id)
            .offset(offset)
            .limit(limit)
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
