from typing import Type

from pydantic import BaseModel
from redis.asyncio import Redis

from app.core.constants import CACHE_TTL


class CacheService:

    def __init__(self, redis: Redis):
        self.redis = redis

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
