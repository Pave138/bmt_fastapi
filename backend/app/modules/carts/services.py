from decimal import Decimal
from uuid import UUID

from app.core.constants import PRODUCT_NOT_FOUND_MSG
from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
    ValidationException,
)
from app.modules.cart_items.repositories import CartItemRepository
from app.modules.carts.repositories import CartRepository
from app.modules.coupons.models import DiscountType
from app.modules.coupons.repositories import CouponRepository
from app.modules.coupons.schemas import CouponCartResponse
from app.modules.product_images.schemas import ProductImageResponse
from app.modules.products.repositories import ProductRepository
from app.modules.products.schemas import CartProduct
from app.services.minio import MinioService

from .models import Cart
from .schemas import ApplyCoupon, CartItemResponse, CartResponse


class CartService:

    def __init__(
        self,
        repository: CartRepository,
        cart_item_repository: CartItemRepository,
        product_repository: ProductRepository,
        coupon_repository: CouponRepository,
        minio_service: MinioService
    ):
        self.repository = repository
        self.cart_item_repository = cart_item_repository
        self.product_repository = product_repository
        self.coupon_repository = coupon_repository
        self.minio_service = minio_service

    async def get_cart(self, user_id: UUID) -> Cart:
        return await self.repository.get_or_create(user_id)
        
    async def add_product(
        self,
        user_id: UUID,
        product_id: int,
        quantity: int = 1
    ) -> None:
        cart = await self.get_cart(user_id)
        product = await self.product_repository.get_by_id(product_id)
        if not product:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        cart_item = await self.cart_item_repository.get_by_product(
            cart.id,
            product_id
        )

        new_quantity = quantity

        if cart_item:
            new_quantity = cart_item.quantity + quantity
        
        if new_quantity > product.stock:
            raise BadRequestException(
                f'Доступное количество товара: {product.stock}'
            )

        if cart_item:
            cart_item.quantity = new_quantity
        else:
            await self.cart_item_repository.create(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity
            )

        await self.repository.session.commit()


    async def update_quantity(
        self,
        user_id: UUID,
        product_id: int,
        quantity: int
    ) -> None:
        cart = await self.get_cart(
            user_id
        )

        cart_item = await self.cart_item_repository.get_by_product(
            cart_id=cart.id,
            product_id=product_id
        )

        if not cart_item:
            raise NotFoundException(
                'Товар отсутствует в корзине'
            )

        if quantity <= 0:
            raise BadRequestException(
                'Количество должно быть больше 0'
            )

        product = await self.product_repository.get_by_id(
            product_id
        )

        if not product:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        if quantity > product.stock:
            raise BadRequestException(
                f'Доступное количество товара: {product.stock}'
            )

        cart_item.quantity = quantity

        await self.repository.session.commit()

    async def remove_product(
        self,
        user_id: UUID,
        product_id: int
    ) -> None:
        cart = await self.get_cart(user_id)

        cart_item = await self.cart_item_repository.get_by_product(
            cart_id=cart.id,
            product_id=product_id
        )

        if not cart_item:
            raise NotFoundException(
                'Товар отсутствует в корзине'
            )

        await self.cart_item_repository.delete_item(cart_item)

        await self.repository.session.commit()

    async def clear_cart(
        self,
        user_id: UUID
    ) -> None:
        cart = await self.get_cart(user_id)

        await self.cart_item_repository.delete_by_cart_id(
            cart.id
        )

        await self.repository.session.commit()

    async def get_cart_response(self, user_id: UUID) -> CartResponse:
        cart = await self.get_cart(user_id)

        total_before_discount = sum(
            item.product.price * item.quantity
            for item in cart.items
        )

        can_apply_coupon = (
            cart.coupon is not None
            and (
                cart.coupon.min_order_amount is None
                or total_before_discount >= cart.coupon.min_order_amount
            )
        )

        items: list[CartItemResponse] = []
        total_price = Decimal('0')
        total_items = 0

        for item in cart.items:
            subtotal = item.product.price * item.quantity

            if (
                can_apply_coupon
                and cart.coupon.discount_type == DiscountType.PERCENT
            ):
                subtotal -= subtotal * cart.coupon.value / Decimal('100')

            total_price += subtotal
            total_items += item.quantity

            main_image = next(
                (
                    image
                    for image in item.product.images
                    if image.is_main
                ),
                None
            )
            main_image_response = None

            if main_image:
                main_image_response = ProductImageResponse(
                    id=main_image.id,
                    product_id=main_image.product_id,
                    original_filename=main_image.original_filename,
                    content_type=main_image.content_type,
                    file_size=main_image.file_size,
                    width=main_image.width,
                    height=main_image.height,
                    is_main=main_image.is_main,
                    image_url=self.minio_service.get_url(main_image.file_key),
                )
            items.append(
                CartItemResponse(
                    product_id=item.product.id,
                    quantity=item.quantity,
                    subtotal=subtotal,
                    product=CartProduct.model_validate(item.product),
                    main_image=main_image_response
                )
            )

        if (
            can_apply_coupon
            and cart.coupon.discount_type == DiscountType.FIXED
        ):
            total_price = max(
                Decimal('0'),
                total_price - cart.coupon.value
            )

        coupon = (
            CouponCartResponse.model_validate(cart.coupon)
            if can_apply_coupon
            else None
        )

        return CartResponse(
            id=cart.id,
            total_items=total_items,
            total_price=total_price,
            coupon=coupon,
            items=items,
        )

    async def apply_coupon(
        self,
        data: ApplyCoupon,
        user_id: UUID
    ) -> None:
        cart = await self.repository.get_by_user_id(user_id)
        coupon = await self.coupon_repository.get_by_code(data.code)
        if coupon is None:
            raise NotFoundException(
                'Купон не существует'
            )
        if coupon.is_expired:
            raise ValidationException(
                f'Срок действия купона истек: {coupon.expires_at}'
            )
        if not coupon.is_available:
            raise ValidationException(
                'Купон недоступен'
            )

        coupon.used_count += 1

        cart.coupon = coupon

        await self.repository.session.commit()

    async def deactivate_coupon(
        self,
        user_id: UUID
    ) -> None:
        cart = await self.repository.get_by_user_id(user_id)

        if cart.coupon.used_count > 0:
            cart.coupon.used_count -= 1

        cart.coupon = None

        await self.repository.session.commit()
