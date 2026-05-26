"""Константы приложения."""

APP_TITLE = 'BMT - Интернет магазин бензоинструмента.'
TOKEN_URL = 'auth/jwt/login'
NAME_AUTH_BACKEND = 'jwt'

CATEGORY_NOT_FOUND_MSG = 'Категория не найдена.'
PRODUCT_NOT_FOUND_MSG = 'Товар не найден.'

CATEGORY_PRODUCTS_CACHE_PATTERN = 'products:category:*'

REDIS_INIT_ERR_MSG = 'Redis client is not initialized'
CACHE_TTL = 300
