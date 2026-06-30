from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.cart_items.dependencies import CartItemRepositoryDep
from app.modules.coupons.dependencies import CouponRepositoryDep
from app.modules.products.dependencies import ProductRepositoryDep

from .repositories import CartRepository
from .services import CartService


async def get_cart_repository(
    session: SessionDep
) -> CartRepository:
    return CartRepository(session)


CartRepositoryDep = Annotated[
    CartRepository,
    Depends(get_cart_repository)
]


async def get_cart_service(
    repository: CartRepositoryDep,
    cart_item_repository: CartItemRepositoryDep,
    product_repository: ProductRepositoryDep,
    coupon_repository: CouponRepositoryDep
) -> CartService:
    return CartService(
        repository,
        cart_item_repository,
        product_repository,
        coupon_repository
    )


CartServiceDep = Annotated[
    CartService,
    Depends(get_cart_service)
]