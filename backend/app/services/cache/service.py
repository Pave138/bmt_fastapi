from structlog import get_logger
from typing import Type

from pydantic import BaseModel
from redis.asyncio import Redis

from app.core.constants import (
    CACHE_TTL,
    CATEGORIES_CACHE_VERSION_KEY,
    CATEGORY_PRODUCTS_CACHE_VERSION_KEY,
    PRODUCT_CACHE_VERSION_KEY,
    PRODUCTS_CACHE_VERSION_KEY,
)

logger = get_logger()


class CacheService:

    def __init__(self, redis: Redis):
        self.redis = redis
        
    async def invalidate_product_cache(self) -> None:
        await self.redis.incr(PRODUCT_CACHE_VERSION_KEY)
        await self.redis.incr(PRODUCTS_CACHE_VERSION_KEY)
        await self.redis.incr(CATEGORIES_CACHE_VERSION_KEY)
        await self.redis.incr(CATEGORY_PRODUCTS_CACHE_VERSION_KEY)

        logger.info(
            'product_cache.invalidate'
        )

    async def get_model(
            self,
            key: str,
            schema: Type[BaseModel]
    ):
        cached = await self.redis.get(key)

        if not cached:
            return None

        return schema.model_validate_json(cached)

    async def set_model(
            self,
            key: str,
            data: BaseModel,
            ttl: int = CACHE_TTL
    ):
        await self.redis.set(
            key,
            data.model_dump_json(),
            ex=ttl
        )

    async def delete(self, key: str):
        await self.redis.delete(key)
