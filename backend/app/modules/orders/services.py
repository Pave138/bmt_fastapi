from decimal import Decimal
from uuid import UUID

from app.core.exceptions import ValidationException
from app.modules.carts.repositories import CartRepository
from app.modules.coupons.models import DiscountType
from app.modules.order_items.repositories import OrderItemRepository
from app.modules.order_items.schemas import OrderItemResponse
from app.modules.payments.models import PaymentMethod
from app.modules.payments.repositories import PaymentRepository
from app.modules.products.schemas import ProductDB
from app.services.base_service import BaseService
from app.services.yookassa import payment_create

from .repositories import OrderRepository
from .schemas import OrderResponse, orders_list_adapter


class OrderService(BaseService):

    def __init__(
        self,
        repository: OrderRepository,
        cart_repository: CartRepository,
        payment_repository: PaymentRepository,
        order_item_repository: OrderItemRepository
    ):
        self.repository = repository
        self.cart_repository = cart_repository
        self.payment_repository = payment_repository
        self.order_item_repository = order_item_repository


    async def create(
        self,
        user_id: UUID,
        payment_method: PaymentMethod
    ) -> OrderResponse:
        cart = await self.cart_repository.get_or_create(user_id)

        if not cart.items:
            raise ValidationException(
                'Корзина пуста'
            )

        order = await self.repository.create(
            user_id=user_id
        )

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
        if can_apply_coupon:
            order.coupon_id = cart.coupon_id

        items: list[OrderItemResponse] = []
        total_price = Decimal('0')

        for item in cart.items:
            subtotal = item.product.price * item.quantity

            if (
                can_apply_coupon
                and cart.coupon.discount_type == DiscountType.PERCENT
            ):
                subtotal -= subtotal * cart.coupon.value / Decimal('100')

            total_price += subtotal

            await self.order_item_repository.create(
                order_id=order.id,
                product_id=item.product_id,
                price_at_purchase=item.product.price,
                quantity=item.quantity
            )

            items.append(
                OrderItemResponse(
                    product=ProductDB.model_validate(item.product),
                    price_at_purchase=item.product.price,
                    quantity=item.quantity
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

        payment = None

        if payment_method == PaymentMethod.CASH:
            await self.payment_repository.create(
                payment_method=payment_method,
                order_id=order.id,
                amount=total_price
            )
        elif payment_method == PaymentMethod.YOOKASSA:
            payment = payment_create(
                amount=total_price,
                order_id=order.id,
                username=user_id
            )

            await self.payment_repository.create(
                payment_method=payment_method,
                order_id=order.id,
                amount=total_price,
                external_payment_id=payment.id,
            )

        confirmation_url = (
            payment.confirmation.confirmation_url if payment else None
        )

        # await self.cart_repository.delete(cart)

        await self.repository.session.commit()

        coupon_code = cart.coupon.code if cart.coupon else None

        return OrderResponse(
            id=order.id,
            status=order.status,
            items=items,
            total_price=total_price,
            coupon_code=coupon_code,
            confirmation_url=confirmation_url
        )

    async def get_by_user_id(
        self,
        user_id: UUID
    ) -> list[OrderResponse]:
        orders = await self.repository.get_by_user_id(user_id)

        return orders_list_adapter.validate_python(orders)
