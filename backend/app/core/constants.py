"""Константы приложения."""

# ===== Application =====

APP_TITLE = 'BMT - Интернет магазин бензоинструмента.'

API_V1_PREFIX = '/api/v1'


# ===== Auth =====

TOKEN_URL = f'{API_V1_PREFIX}/auth/jwt/login'
NAME_AUTH_BACKEND = 'jwt'


# ===== Cache / Redis =====

REDIS_INIT_ERR_MSG = 'Redis client is not initialized'

CACHE_TTL = 60 * 60

CATEGORIES_CACHE_VERSION_KEY = 'cache:categories:version'
PRODUCT_CACHE_VERSION_KEY = 'cache:product:version'
PRODUCTS_CACHE_VERSION_KEY = 'cache:products:version'
CATEGORY_PRODUCTS_CACHE_VERSION_KEY = 'cache:category_products:version'

CATEGORY_PRODUCTS_CACHE_PATTERN = 'products:category:*'
PRODUCTS_CACHE_PATTERN = 'products:*'
REVIEW_CACHE_PATTERN = 'reviews:product:*'


# ===== Pagination =====

LIMIT_PRODUCTS = 10
OFFSET_PRODUCTS = 0


# ===== Category =====

CATEGORY_NOT_FOUND_MSG = 'Категория не найдена.'

CATEGORY_NAME_MAX_LENGTH = 255
CATEGORY_EXAMPLE_NAME = 'Велосипеды'


# ===== Product =====

PRODUCT_NOT_FOUND_MSG = 'Товар не найден.'

PRODUCT_NAME_MAX_LENGTH = 255

PRODUCT_PRICE_PRECISION = 10
PRODUCT_PRICE_SCALE = 2
PRODUCT_PRICE_GT = 0

DEFAULT_PRODUCT_STOCK = 0
PRODUCT_STOCK_GE = 0

PRODUCT_OLD_PRICE_INVALID_MSG = (
    'Старая цена должна быть больше текущей.'
)


# ===== ProductSpecification =====

PRODUCT_SPECIFICATION_NAME_MAX_LENGTH = 100
PRODUCT_SPECIFICATION_VALUE_MAX_LENGTH = 512
PRODUCT_SPECIFICATION_NOT_FOUND_MSG = 'Характеристика товара не найдена.'


# ===== ProductImage =====

PRODUCT_IMAGE_MAX_SIZE = 10 * 1024 * 1024
PRODUCT_IMAGE_FILE_KEY_MAX_LENGTH = 512
PRODUCT_IMAGE_ORIGINAL_FILENAME_MAX_LENGTH = 255
PRODUCT_IMAGE_CONTENT_TYPE_MAX_LENGTH = 100
PRODUCT_IMAGE_ALLOWED_TYPES = {
    'image/jpeg',
    'image/png',
    'image/webp'
}


# ===== Review =====

REVIEW_NOT_FOUND_MSG = 'Отзыв не найден.'

REVIEW_RATING_GE = 1
REVIEW_RATING_LE = 5

REVIEW_COMMENT_MAX_LENGTH = 512
REVIEW_EXAMPLE_COMMENT = (
    'Все хорошо, приехал, купил, работает!'
)


# ===== Cart =====

CART_NOT_FOUND_MSG = 'Корзина не найдена'
CART_ALREADY_EXISTS_MSG = 'Корзина существует'

