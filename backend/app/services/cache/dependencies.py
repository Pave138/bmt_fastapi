from typing import Annotated

from fastapi import Depends, Request
from redis.asyncio import Redis

from .service import CacheService


async def get_redis(request: Request) -> Redis:
    return request.app.state.redis


RedisDep = Annotated[Redis, Depends(get_redis)]


async def get_cache_service(
        redis: RedisDep
) -> CacheService:
    return CacheService(redis)


CacheServiceDep = Annotated[CacheService, Depends(get_cache_service)]
