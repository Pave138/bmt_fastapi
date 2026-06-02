from typing import Optional

import structlog
from redis.asyncio import Redis

from app.core.constants import CACHE_TTL, CATEGORY_NOT_FOUND_MSG, CATEGORY_PRODUCTS_CACHE_PATTERN
from app.core.exceptions import ConflictException, NotFoundException
from app.modules.categories.repositories import CategoryRepository
from app.modules.products.models import Product
from app.services.cache.keys import get_categories_key

from .models import Category
from .schemas import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
    categories_list_adapter, build_category_tree
)
from app.services.base_service import BaseService

logger = structlog.get_logger()


class CategoryService(BaseService):

    def __init__(
        self,
        repository: CategoryRepository,
        redis: Redis
    ):
        self.repository = repository
        self.redis = redis

    async def create_category(self, data: CategoryCreate) -> CategoryResponse:
        if data.parent_id:
            if not await self.repository.exists(data.parent_id):
                raise NotFoundException(
                    f'Подкатегория {data.parent_id} не найдена'
                )
        try:
            category = await self.repository.create(data.model_dump())
            await self.repository.session.commit()
            await self.repository.session.refresh(category)
            logger.debug(
                'category.create',
                category_id=category.id
            )

            await self.invalidate_category_cache()

            return CategoryResponse.model_validate(category)
        except Exception:
            await self.repository.session.rollback()
            logger.exception(
                'category.create_failed'
            )
            raise

    async def get_categories(
        self
    ) -> list[CategoryResponse]:
        cache_key = get_categories_key()
        cached = await self.redis.get(
            cache_key
        )

        if cached:
            logger.debug(
                'categories.loaded',
                source='cache'
            )
            return categories_list_adapter.validate_json(
                cached
            )

        rows = await self.repository.get_all_for_tree()
        nodes = {}

        for row in rows:
            nodes[row["id"]] = CategoryResponse(
                **row
            )

        roots = []

        for node in nodes.values():
            if node.parent_id is None:
                roots.append(
                    node
                )
            else:
                parent = nodes.get(
                    node.parent_id
                )
                if parent:
                    parent.children.append(
                        node
                    )

        await self.redis.set(
            cache_key,
            categories_list_adapter.dump_json(
                roots
            ),
            ex=CACHE_TTL
        )
        logger.debug(
            'categories.loaded',
            source='db'
        )
        return roots

    async def get_by_id(self, category_id: int) -> CategoryResponse:

        category = await self.repository.get_by_id(category_id)

        if not category:
            raise NotFoundException(
                CATEGORY_NOT_FOUND_MSG
            )

        response = build_category_tree(category)

        logger.debug(
            'category.loaded',
            source='db',
            category_id=category_id
        )
        return response

    async def invalidate_category_cache(
            self
    ):
        await self.redis.delete(get_categories_key())

        logger.info(
            'category_cache_invalidated'
        )

    async def update(
        self,
        category_id: int,
        data: CategoryUpdate
    ) -> CategoryResponse:

        category = await self.get_by_id(category_id)
        update_data = data.model_dump(exclude_unset=True)
        if 'parent_id' in update_data:
            await self.get_by_id(update_data['parent_id'])

        await self.invalidate_category_cache()

        logger.debug(
            'category.update',
            category_id=category_id
        )

        return await self.update_model(
            category,
            update_data,
            self.repository.session
        )

    async def delete(self, category_id: int) -> None:
        category = await self.get_by_id(category_id)

        if category.products and len(category.products) > 0:
            products_count = len(category.products)
            raise ConflictException(
                (f'Невозможно удалить категорию {category.name}, так как '
                 f'у нее есть {products_count} связанных товаров.')
            )

        try:
            await self.repository.session.delete(category)
            await self.repository.session.commit()
        except Exception:
            await self.repository.session.rollback()
            raise

    async def get_product_by_category(
        self,
        category_id: int
    ) -> list[Product]:
        category = await self.get_by_id(category_id)
        return category.products
