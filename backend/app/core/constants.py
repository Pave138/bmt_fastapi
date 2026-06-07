"""Константы приложения."""

APP_TITLE = 'BMT - Интернет магазин бензоинструмента.'

API_V1_PREFIX = '/api/v1'

TOKEN_URL = f'{API_V1_PREFIX}/auth/jwt/login'
NAME_AUTH_BACKEND = 'jwt'

REDIS_INIT_ERR_MSG = 'Redis client is not initialized'
CACHE_TTL = 60 * 60

CATEGORY_NOT_FOUND_MSG = 'Категория не найдена.'
PRODUCT_NOT_FOUND_MSG = 'Товар не найден.'

PRODUCT_NAME_MAX_LENGTH = 255
PRODUCT_PRICE_PRECISION = 10
PRODUCT_PRICE_SCALE = 2
DEFAULT_PRODUCT_STOCK = 1
PRODUCT_PRICE_GT = 0
PRODUCT_STOCK_GE = 0

PRODUCT_OLD_PRICE_INVALID_MSG = 'Старая цена должна быть больше текущей.'

CATEGORY_PRODUCTS_CACHE_PATTERN = 'products:category:*'
PRODUCTS_CACHE_VERSION_KEY = 'cache:products:version'
PRODUCT_CACHE_VERSION_KEY = 'cache:product:version'
CATEGORY_PRODUCTS_CACHE_VERSION_KEY = 'cache:category_products:version'
PRODUCTS_CACHE_PATTERN = 'products:*'
REVIEW_CACHE_PATTERN = 'reviews:product:*'

LIMIT_PRODUCTS = 10
OFFSET_PRODUCTS = 0

REVIEW_RATING_GE = 1
REVIEW_RATING_LE = 5
REVIEW_NOT_FOUND_MSG = 'Отзыв не найден.'
