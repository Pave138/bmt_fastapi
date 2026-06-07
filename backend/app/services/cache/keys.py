from redis.asyncio import Redis

from app.core.constants import PRODUCTS_CACHE_VERSION_KEY, CATEGORY_PRODUCTS_CACHE_VERSION_KEY


def get_product_key(product_id: int, version: str) -> str:
    return f'product:v{version}:{product_id}'


async def get_products_key(redis: Redis, limit: int, offset: int) -> str:
    version = await redis.get(PRODUCTS_CACHE_VERSION_KEY)
    version = version or '1'
    return f'products:v{version}:{limit}:{offset}'


async def get_category_products_key(
    redis: Redis,
    category_id: int,
    limit: int,
    offset: int
) -> str:
    version = await redis.get(CATEGORY_PRODUCTS_CACHE_VERSION_KEY)
    version = version or '1'
    return f'category_products:v{version}:{category_id}:{limit}:{offset}'


def get_categories_key() -> str:
    return'categories_tree'



def get_product_reviews_key(product_id: int) -> str:
    return f'reviews:product:{product_id}'
