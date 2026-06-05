"""Константы приложения."""

APP_TITLE = 'BMT - Интернет магазин бензоинструмента.'

API_V1_PREFIX = '/api/v1'

TOKEN_URL = f'{API_V1_PREFIX}/auth/jwt/login'
NAME_AUTH_BACKEND = 'jwt'

REDIS_INIT_ERR_MSG = 'Redis client is not initialized'
CACHE_TTL = 300

CATEGORY_NOT_FOUND_MSG = 'Категория не найдена.'
PRODUCT_NOT_FOUND_MSG = 'Товар не найден.'

CATEGORY_PRODUCTS_CACHE_PATTERN = 'products:category:*'
REVIEW_CACHE_PATTERN = 'reviews:product:*'

LIMIT_PRODUCTS = 10
OFFSET_PRODUCTS = 0

REVIEW_RATING_GE = 1
REVIEW_RATING_LE = 5
REVIEW_NOT_FOUND_MSG = 'Отзыв не найден.'
