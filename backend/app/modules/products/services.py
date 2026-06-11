from io import BytesIO
from uuid import uuid4

import structlog
from fastapi import UploadFile
from PIL import Image
from redis.asyncio import Redis
from sqlalchemy.exc import IntegrityError

from app.core.constants import (
    CACHE_TTL,
    CATEGORIES_CACHE_VERSION_KEY,
    CATEGORY_NOT_FOUND_MSG,
    CATEGORY_PRODUCTS_CACHE_VERSION_KEY,
    PRODUCT_CACHE_VERSION_KEY,
    PRODUCT_IMAGE_ALLOWED_TYPES,
    PRODUCT_IMAGE_MAX_SIZE,
    PRODUCT_NOT_FOUND_MSG,
    PRODUCT_OLD_PRICE_INVALID_MSG,
    PRODUCTS_CACHE_VERSION_KEY,
)
from app.core.exceptions import (
    ConflictException,
    NotFoundException,
    ValidationException,
)
from app.modules.categories.repositories import CategoryRepository
from app.services.base_service import BaseService
from app.services.cache.keys import (
    get_category_products_key,
    get_product_key,
    get_products_key,
)
from app.services.minio import MinioService

from .repositories import ProductImageRepository, ProductRepository
from .schemas import (
    ProductCreate,
    ProductDB,
    ProductImageResponse,
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

    async def invalidate_product_cache(self) -> None:
        await self.redis.incr(PRODUCT_CACHE_VERSION_KEY)
        await self.redis.incr(PRODUCTS_CACHE_VERSION_KEY)
        await self.redis.incr(CATEGORIES_CACHE_VERSION_KEY)
        await self.redis.incr(CATEGORY_PRODUCTS_CACHE_VERSION_KEY)

        logger.info(
            'product_cache.invalidate'
        )

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

            await self.invalidate_product_cache()

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
        cache_key = await get_product_key(self.redis, product_id)
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

        row = await self.repository.get_by_id_with_reviews_and_stats(
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

        await self.invalidate_product_cache()

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

            await self.invalidate_product_cache()

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


class ProductImageService:

    def __init__(
        self,
        product_repository: ProductRepository,
        image_repository: ProductImageRepository,
        minio_service: MinioService
    ):
        self.product_repository = product_repository
        self.image_repository = image_repository
        self.minio_service = minio_service

    async def upload_image(
        self,
        product_id: int,
        file: UploadFile,
        is_main: bool = False
    ):
        product = await self.product_repository.get_by_id(
            product_id
        )

        if not product:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        if file.content_type not in PRODUCT_IMAGE_ALLOWED_TYPES:
            raise ValidationException(
                'Неподдерживаемый тип изображения'
            )

        content = await file.read()

        if len(content) > PRODUCT_IMAGE_MAX_SIZE:
            raise ValidationException(
                'Изображение слишком большое'
            )

        image = Image.open(
            BytesIO(content)
        )

        width, height = image.size

        extension = file.filename.split('.')[-1]

        file_key = (
            'products/'
            f'{product_id}/'
            f'{uuid4()}.{extension}'
        )

        await self.minio_service.upload(
            file_key=file_key,
            data=content,
            content_type=file.content_type
        )

        try:
            if is_main:
                await self.image_repository.unset_main(
                    product_id
                )

                db_image = await self.image_repository.create(
                    product_id=product_id,
                    file_key=file_key,

                    original_filename=file.filename,
                    content_type=file.content_type,

                    file_size=len(content),

                    width=width,
                    height=height,
                    is_main=is_main
                )

                await self.image_repository.session.commit()
                await self.image_repository.session.refresh(
                    db_image
                )

                return ProductImageResponse(
                    **db_image.__dict__,
                    image_url=self.minio_service.get_url(
                        db_image.file_key
                    )
                )

        except IntegrityError:
            await self.image_repository.session.rollback()
            await self.minio_service.remove(
                file_key
            )
            raise ConflictException(
                'Изображение существует'
            )

    async def delete_image(
        self,
        image_id: int
    ):
        image = await self.image_repository.get_by_id(
            image_id
        )

        if not image:
            raise NotFoundException(
                'Изображение не найдено'
            )

        await self.minio_service.remove(
            image.file_key
        )

        await self.image_repository.delete(
            image
        )

        await self.image_repository.session.commit()

    async def get_product_images(
        self,
        product_id: int
    ) -> list[ProductImageResponse]:

        images = await self.image_repository.get_product_images(
            product_id
        )

        return [
            ProductImageResponse(
                **img.__dict__,
                image_url=self.minio_service.get_url(
                    img.file_key
                )
            )
            for img in images
        ]
