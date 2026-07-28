from uuid import UUID

from app.core.exceptions import ValidationException
from app.modules.carts.repositories import CartRepository
from app.modules.order_items.repositories import OrderItemRepository
from app.modules.orders.repositories import OrderRepository
from app.modules.payments.models import PaymentMethod
from app.modules.payments.repositories import PaymentRepository
from app.services.base_service import BaseService


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


    async def create(self, user_id: UUID, payment_method: PaymentMethod):
        cart = await self.cart_repository.get_or_create(user_id)

        if not cart.items:
            raise ValidationException(
                'Корзина пуста'
            )

        order = await self.repository.create(
            user_id=user_id,

        )



