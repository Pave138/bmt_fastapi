from fastapi import APIRouter

from .categories import router as admin_category_router
from .coupons import router as admin_coupon_router
from .orders import router as admin_order_router
from .product_images import router as admin_product_image_router
from .product_specifications import router as admin_product_specification_router
from .products import router as admin_product_router

admin_router = APIRouter()

admin_router.include_router(
    admin_category_router,
    prefix='/categories'
)

admin_router.include_router(
    admin_coupon_router,
    prefix='/coupons'
)

admin_router.include_router(
    admin_order_router,
    prefix='/orders'
)

admin_router.include_router(
    admin_product_image_router,
    prefix='/products'
)

admin_router.include_router(
    admin_product_specification_router,
    prefix='/specs'
)

admin_router.include_router(
    admin_product_router,
    prefix='/products'
)
