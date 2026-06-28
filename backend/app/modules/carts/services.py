from decimal import Decimal
from uuid import UUID

from app.core.constants import PRODUCT_NOT_FOUND_MSG
from app.core.exceptions import BadRequestException, NotFoundException
from app.modules.cart_items.repositories import CartItemRepository
from app.modules.carts.repositories import CartRepository
from app.modules.products.repositories import ProductRepository

from .models import Cart
from .schemas import CartItemResponse, CartProduct, CartResponse


class CartService:

    def __init__(
        self,
        repository: CartRepository,
        cart_item_repository: CartItemRepository,
        product_repository: ProductRepository
    ):
        self.repository = repository
        self.cart_item_repository = cart_item_repository
        self.product_repository = product_repository

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

        items = []
        total_price = Decimal('0')
        total_items = 0

        for item in cart.items:
            subtotal = item.product.price * item.quantity

            total_price += subtotal
            total_items += item.quantity

            items.append(
                CartItemResponse(
                    product_id=item.product.id,
                    quantity=item.quantity,
                    subtotal=subtotal,
                    product=CartProduct.model_validate(item.product),
                )
            )

        return CartResponse(
            id=cart.id,
            total_items=total_items,
            total_price=total_price,
            items=items,
        )
