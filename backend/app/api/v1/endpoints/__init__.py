from .auth import router as auth_router
from .carts import router as cart_router
from .categories import router as category_router
from .coupons import router as coupon_router
from .product_images import router as product_image_router
from .product_specifications import router as product_specification_router
from .products import router as product_router
from .reviews import router as review_router
from .users import router as user_router

__all__ = [
    'auth_router',
    'cart_router',
    'category_router',
    'coupon_router',
    'product_router',
    'product_specification_router',
    'product_image_router',
    'review_router',
    'user_router'
]
