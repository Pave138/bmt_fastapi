from uuid import UUID

from app.modules.carts.repositories import CartRepository
from app.modules.products.repositories import ProductRepository

from .schemas import CartCreate, CartResponse
from ..cart_items.repositories import CartItemRepository
from ...core.constants import PRODUCT_NOT_FOUND_MSG
from ...core.exceptions import NotFoundException, BadRequestException


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

    async def get_cart(self, user_id: UUID) -> CartResponse:
        cart = await self.repository.get_or_create(user_id)

        return CartResponse.model_validate(cart)

    async def create_cart(self, data: CartCreate) -> CartResponse:

        try:
            cart = await self.repository.create(data.model_dump())
            await self.repository.session.commit()
            await self.repository.session.refresh(cart)
            return CartResponse.model_validate(cart)
        except Exception:
            await self.repository.session.rollback()
            raise
        
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
        
        if product.stock < quantity:
            raise BadRequestException(
                f'Доступное количество товара: {product.stock}'
            )

        cart_item = await self.cart_item_repository.get_by_product(
            cart.id,
            product_id
        )

        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = await self.cart_item_repository.create(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity
            )

        self.repository.session.add(cart_item)
        await self.repository.session.commit()
        

    async def delete_cart(self, user_id: UUID) -> None:
        cart = await self.repository.get_by_user_id(user_id)
        await self.repository.delete(cart)
