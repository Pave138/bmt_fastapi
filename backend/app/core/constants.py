"""Константы приложения."""

APP_TITLE = 'BMT - Интернет магазин бензоинструмента.'
TOKEN_URL = '/api/v1/auth/jwt/login'
NAME_AUTH_BACKEND = 'jwt'

REDIS_INIT_ERR_MSG = 'Redis client is not initialized'
CACHE_TTL = 300

CATEGORY_NOT_FOUND_MSG = 'Категория не найдена.'
PRODUCT_NOT_FOUND_MSG = 'Товар не найден.'

CATEGORY_PRODUCTS_CACHE_PATTERN = 'products:category:*'
REVIEW_CACHE_PATTERN = 'reviews:product:*'

REVIEW_RATING_GE = 1
REVIEW_RATING_LE = 5
REVIEW_NOT_FOUND_MSG = 'Отзыв не найден.'
