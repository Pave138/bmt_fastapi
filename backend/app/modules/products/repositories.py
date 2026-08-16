from sqlalchemy import Select, and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased, selectinload

from app.modules.categories.repositories import CategoryRepository
from app.modules.product_images.models import ProductImage
from app.modules.reviews.models import Review

from .models import Product


class ProductRepository:

    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    @staticmethod
    def _build_products_with_stats_query(
        category_slug: str | None = None,
        search: str | None = None,
    ) -> Select:

        main_image = aliased(ProductImage)

        query = (
            select(
                Product,
                main_image,
                func.coalesce(
                    func.round(
                        func.avg(Review.rating),
                        1,
                    ),
                    0,
                ).label("avg_rating"),
                func.count(
                    Review.id
                ).label("reviews_count"),
            )
            .outerjoin(
                main_image,
                and_(
                    main_image.product_id == Product.id,
                    main_image.is_main.is_(True),
                ),
            )
            .outerjoin(
                Review,
                Review.product_id == Product.id,
            )
        )

        if category_slug is not None:
            category_tree = (
                CategoryRepository.descendants_cte(
                    category_slug
                )
            )

            query = query.where(
                Product.category_id.in_(
                    select(category_tree.c.id)
                )
            )

        if search:
            query = query.where(
                Product.name.ilike(
                    f"%{search}%"
                )
            )

        return query.group_by(
            Product.id,
            main_image.id,
        )

    async def get_all(
        self,
        category_slug: str | None,
        search: str | None,
        limit: int,
        offset: int,
    ) -> list[
        tuple[
            Product,
            ProductImage | None,
            float,
            int,
        ]
    ]:

        result = await self.session.execute(
            self._build_products_with_stats_query(
                category_slug=category_slug,
                search=search,
            )
            .offset(offset)
            .limit(limit)
        )

        return result.all()

    async def get_by_id(
        self,
        product_id: int,
    ) -> Product | None:

        result = await self.session.execute(
            select(Product)
            .where(
                Product.id == product_id
            )
        )

        return result.scalar_one_or_none()

    async def get_by_slug(
        self,
        product_slug: str,
    ) -> Product | None:

        result = await self.session.execute(
            select(Product)
            .where(
                Product.slug == product_slug
            )
        )

        return result.scalar_one_or_none()

    async def get_by_slug_with_all(
        self,
        product_slug: str,
    ) -> tuple[
        Product | None,
        float,
        int,
    ]:

        product_result = await self.session.execute(
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.specifications),
            )
            .where(
                Product.slug == product_slug
            )
        )

        product = (
            product_result.scalar_one_or_none()
        )

        if product is None:
            return None, 0.0, 0

        stats_result = await self.session.execute(
            select(
                func.coalesce(
                    func.round(
                        func.avg(
                            Review.rating
                        ),
                        1,
                    ),
                    0,
                ).label("avg_rating"),
                func.count(
                    Review.id
                ).label("reviews_count"),
            )
            .select_from(Review)
            .where(
                Review.product_id == product.id
            )
        )

        avg_rating, reviews_count = (
            stats_result.one()
        )

        return (
            product,
            float(avg_rating),
            int(reviews_count),
        )

    async def get_all_by_category_slug(
        self,
        category_slug: str,
        limit: int,
        offset: int,
    ) -> list[
        tuple[
            Product,
            ProductImage | None,
            float,
            int,
        ]
    ]:

        result = await self.session.execute(
            self._build_products_with_stats_query(
                category_slug=category_slug,
                search=None,
            )
            .offset(offset)
            .limit(limit)
        )

        return result.all()

    async def create(
        self,
        data: dict,
    ) -> Product:

        product = Product(**data)

        self.session.add(product)

        await self.session.flush()

        return product

    async def delete(
        self,
        product: Product,
    ) -> None:

        await self.session.delete(product)

    async def exists_by_id(
        self,
        product_id: int,
    ) -> bool:

        result = await self.session.execute(
            select(Product)
            .where(
                Product.id == product_id
            )
        )

        return (
            result.scalar_one_or_none()
            is not None
        )

    async def get_by_id_for_update(
        self,
        product_id: int,
    ) -> Product | None:

        result = await self.session.execute(
            select(Product)
            .where(
                Product.id == product_id
            )
            .with_for_update()
        )

        return result.scalar_one_or_none()