from redis.asyncio import Redis

from app.core.constants import (
    CATEGORIES_CACHE_VERSION_KEY,
    CATEGORY_PRODUCTS_CACHE_VERSION_KEY,
    PRODUCT_CACHE_VERSION_KEY,
    PRODUCTS_CACHE_VERSION_KEY,
)


async def get_categories_key(redis: Redis) -> str:
    version = await redis.get(CATEGORIES_CACHE_VERSION_KEY)
    version = version or '1'
    return f'categories:v{version}'


async def get_product_key(redis: Redis, product_slug: str) -> str:
    version = await redis.get(PRODUCT_CACHE_VERSION_KEY)
    version = version or '1'
    return f'product:v{version}:{product_slug}'


async def get_products_key(
    redis: Redis,
    category_slug: str | None,
    search: str | None,
    limit: int,
    offset: int
) -> str:
    version = await redis.get(PRODUCTS_CACHE_VERSION_KEY)
    version = version or '1'
    return (
        f'products:'
        f'v{version}:'
        f'category:{category_slug}:'
        f'search:{search or 'all'}:'
        f'limit:{limit}'
        f'offset:{offset}'
    )


async def get_category_products_key(
    redis: Redis,
    category_slug: str,
    limit: int,
    offset: int
) -> str:
    version = await redis.get(CATEGORY_PRODUCTS_CACHE_VERSION_KEY)
    version = version or '1'
    return f'category_products:v{version}:{category_slug}:{limit}:{offset}'


def get_product_reviews_key(product_id: int) -> str:
    return f'reviews:product:{product_id}'
