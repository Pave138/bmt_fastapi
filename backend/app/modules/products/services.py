from typing import Optional

import structlog
from redis.asyncio import Redis
from sqlalchemy.exc import IntegrityError

from app.core.constants import (
    CACHE_TTL,
    CATEGORY_NOT_FOUND_MSG,
    CATEGORY_PRODUCTS_CACHE_PATTERN,
    PRODUCT_CACHE_VERSION_KEY,
    PRODUCT_NOT_FOUND_MSG, PRODUCT_OLD_PRICE_INVALID_MSG, PRODUCTS_CACHE_PATTERN, PRODUCTS_CACHE_VERSION_KEY,
    CATEGORY_PRODUCTS_CACHE_VERSION_KEY
)
from app.core.exceptions import NotFoundException, ValidationException, ConflictException
from app.modules.categories.repositories import CategoryRepository
from app.services.base_service import BaseService
from app.services.cache.keys import (
    get_category_products_key,
    get_product_key,
    get_products_key,
)

from .repositories import ProductRepository
from .schemas import (
    ProductCreate,
    ProductDB,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
    products_list_adapter,
)

logger = structlog.get_logger()


class ProductService(BaseService):

    def __init__(
        self,
        repository: ProductRepository,
        category_repository: CategoryRepository,
        redis: Redis
    ):
        self.repository = repository
        self.category_repository = category_repository
        self.redis = redis

    async def get_all(
        self,
        limit: int,
        offset: int
    ) -> list[ProductListResponse]:
        cache_key = await get_products_key(self.redis, limit, offset)

        cached_products = await self.redis.get(cache_key)

        if cached_products is not None:
            try:
                logger.debug(
                    'products.loaded',
                    source='redis',
                    limit=limit,
                    offset=offset
                )

                return products_list_adapter.validate_json(
                    cached_products
                )
            except Exception:
                await self.redis.delete(cache_key)
                logger.exception(
                    'products.loaded_failed',
                    source='redis',
                    limit=limit,
                    offset=offset
                )

        products = await self.repository.get_all(
            limit=limit,
            offset=offset
        )

        response = [
            ProductListResponse(
                id=product.id,
                name=product.name,
                description=product.description,
                price=product.price,
                old_price=product.old_price,
                stock=product.stock,
                category_id=product.category_id,

                avg_rating=float(avg_rating),
                reviews_count=reviews_count
            )
            for product, avg_rating, reviews_count in products
        ]

        await self.redis.set(
            cache_key,
            products_list_adapter.dump_json(response),
            ex=CACHE_TTL
        )

        logger.info(
            'products.loaded',
            source='db',
            limit=limit,
            offset=offset
        )
        return response

    async def create(
        self,
        data: ProductCreate
    ) -> ProductDB:

        if not await self.category_repository.exists(data.category_id):
            logger.warning(
                'category.not_found',
                category_id=data.category_id
            )
            raise NotFoundException(
                CATEGORY_NOT_FOUND_MSG
            )

        try:
            product = await self.repository.create({
                **data.model_dump()
            })
            await self.repository.session.commit()
            await self.redis.incr(PRODUCT_CACHE_VERSION_KEY)
            await self.redis.incr(CATEGORY_PRODUCTS_CACHE_VERSION_KEY)
            await self.repository.session.refresh(
                product
            )
            logger.debug(
                'product.create',
                product_id=product.id,
                category_id=product.category_id
            )
            return ProductDB.model_validate(product)

        except IntegrityError:
            await self.repository.session.rollback()
            logger.exception(
                'product.duplicate',
                name=data.name,
                category_id=data.category_id
            )
            raise ConflictException(
                (
                    f'Товар с именем {data.name} уже существует '
                    f'в {data.category_id} категории.'
                )
            )

    async def get_by_id(
            self,
            product_id: int
    ) -> ProductResponse:
        cache_key = get_product_key(product_id, version='1')
        cached_product = await self.redis.get(
            cache_key
        )
        if cached_product:
            try:
                logger.info(
                    'product.loaded',
                    product_id=product_id,
                    source='redis'
                )
                return ProductResponse.model_validate_json(
                    cached_product
                )

            except Exception:
                logger.exception(
                    'invalid.product.cache',
                    product_id=product_id
                )
                await self.redis.delete(
                    cache_key
                )

        row = await self.repository.get_by_id(
            product_id
        )
        if row is None:
            logger.warning(
                'product.not_found',
                product_id=product_id
            )
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        product, avg_rating, reviews_count = row

        response = ProductResponse(
            id=product.id,
            name=product.name,
            description=product.description,

            price=product.price,
            old_price=product.old_price,

            stock=product.stock,
            is_active=product.is_active,

            category_id=product.category_id,

            created_at=product.created_at,
            updated_at=product.updated_at,

            reviews=product.reviews,

            avg_rating=float(avg_rating),
            reviews_count=reviews_count
        )

        await self.redis.set(
            cache_key,
            response.model_dump_json(),
            ex=CACHE_TTL
        )
        logger.info(
            'product.loaded',
            product_id=product_id,
            source='db'
        )
        return response

    async def get_by_category_id(
        self,
        category_id: int,
        limit: int = 100,
        offset: int = 0
    ) -> list[ProductResponse]:
        cache_key = await get_category_products_key(
            self.redis,
            category_id,
            limit,
            offset
        )

        cached_products = await self.redis.get(cache_key)

        if cached_products:
            logger.info(
                'products.category.cache_hit',
                category_id=category_id
            )
            return products_list_adapter.validate_json(
                cached_products
            )
        
        if not await self.category_repository.exists(category_id):
            logger.warning(
                'category.not_found',
                category_id=category_id
            )
            raise NotFoundException(
                CATEGORY_NOT_FOUND_MSG
            )

        products = await self.repository.get_all_by_category_id(
            category_id=category_id,
            limit=limit,
            offset=offset
        )

        response = [
            ProductResponse.model_validate(product)
            for product in products
        ]
        await self.redis.set(
            cache_key,
            products_list_adapter.dump_json(response),
            ex=CACHE_TTL
        )
        logger.info(
            'products.category.cached',
            category_id=category_id,
            count=len(response)
        )
        return response

    async def update(
        self,
        product_id: int,
        data: ProductUpdate
    ) -> ProductDB:
        product = await self.repository.get_by_id_for_update(product_id)


        if not product:
            logger.warning(
                'product.not_found',
                product_id=product_id
            )
            raise NotFoundException(PRODUCT_NOT_FOUND_MSG)

        update_data = data.model_dump(exclude_unset=True)

        new_price = update_data.get('price', product.price)
        new_old_price = update_data.get('old_price', product.old_price)

        if (
            new_old_price is not None
            and new_old_price <= new_price
        ):
            raise ValidationException(
                PRODUCT_OLD_PRICE_INVALID_MSG
            )

        category_id = update_data.get('category_id')

        if category_id is not None:
            exists = await self.category_repository.exists(
                category_id
            )

            if not exists:
                raise NotFoundException(
                    CATEGORY_NOT_FOUND_MSG
                )

        result = await self.update_model(
            product,
            update_data,
            self.repository.session
        )
        await self.redis.incr(PRODUCTS_CACHE_VERSION_KEY)
        await self.redis.incr(CATEGORY_PRODUCTS_CACHE_VERSION_KEY)
        await self.redis.incr(PRODUCT_CACHE_VERSION_KEY)

        return result

    async def delete(self, product_id: int) -> None:
        product = await self.repository.get_by_id(product_id)

        if not product:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        try:
            await self.repository.delete(product)
            await self.repository.session.commit()
            await self.redis.incr(PRODUCTS_CACHE_VERSION_KEY)
            await self.redis.incr(CATEGORY_PRODUCTS_CACHE_VERSION_KEY)
            await self.redis.incr(PRODUCT_CACHE_VERSION_KEY)

            logger.info(
                'product.deleted',
                product_id=product_id
            )

        except Exception:
            await self.repository.session.rollback()

            logger.exception(
                'product.delete_failed',
                product_id=product_id
            )
            raise
