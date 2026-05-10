from .models import Product
from .repositories import ProductRepository
from .schemas import ProductCreate, ProductUpdate
from app.modules.categories.dependencies import CategoryServiceDep
from app.core.exceptions import NotFoundException, ValidationException
from app.core.constants import CATEGORY_NOT_FOUND_MSG, PRODUCT_NOT_FOUND_MSG


class ProductService:

    def __init__(
        self,
        repository: ProductRepository,
        category_service: CategoryServiceDep
    ):
        self.repository = repository
        self.category_service = category_service

    async def get_all(
        self,
        limit: int = 100,
        offset: int = 0
    ) -> list[Product]:
        return await self.repository.get_all(
            limit=limit,
            offset=offset
        )

    async def create(self, data: ProductCreate) -> Product:
        if data.price <= 0:
            raise ValidationException(
                'Цена должна быть положительной.'
            )
        if (data.old_price is not None
            and data.old_price <= data.price
        ):
                raise ValidationException(
                    'Старая цена должна быть больше текущей.'
                )
        if data.stock < 0:
            raise ValidationException(
                'Количество товара не может быть отрицательным.'
            )

        category = await self.category_service.get_by_id(data.category_id)
        if category is None:
            raise NotFoundException(
                'Категория не найдена'
            )
        try:
            product = await self.repository.create(
                data.model_dump()
            )
            await self.repository.session.commit()
            await self.repository.session.refresh(product)
            return product
        except Exception:
            await self.repository.session.rollback()
            raise

    async def get_by_id(self, product_id: int) -> Product:
        product = await self.repository.get_by_id(product_id)
        if not product:
            raise NotFoundException(PRODUCT_NOT_FOUND_MSG)
        return product

    async def get_by_category_id(
        self,
        category_id: int,
        limit: int = 100,
        offset: int = 0
    ) -> list[Product]:
        category = await self.category_service.get_by_id(category_id)
        if not category:
            raise NotFoundException(CATEGORY_NOT_FOUND_MSG)
        return await self.repository.get_all_by_category_id(
            category_id=category_id,
            limit=limit,
            offset=offset
        )

    async def update(
        self,
        product_id: int,
        data: ProductUpdate
    ) -> Product:
        product = await self.get_by_id(product_id)
        update_data = data.model_dump(exclude_unset=True)

        ## Validation.

        if 'price' in update_data:
            if update_data['price'] <= 0:
                raise ValidationException(
                    'Цена должна быть положительной.'
                )
        new_price = update_data.get('price', product.price)
        new_old_price = update_data.get('old_price', product.old_price)

        if (
            new_old_price is not None
            and new_old_price <= new_price
        ):
            raise ValidationException(
                'Старая цена должна быть больше текущей.'
            )

        if 'stock' in update_data:
            if update_data['stock'] < 0:
                raise ValidationException(
                    'Количество товара не может быть отрицательным.'
                )

        if 'category_id' in update_data:
            category = await self.category_service.get_by_id(
                update_data['category_id']
            )
            if category is None:
                raise NotFoundException(
                    CATEGORY_NOT_FOUND_MSG
                )

        ## Update fields.

        for field, value in update_data.items():
            setattr(product, field, value)

        ## Save.

        try:
            await self.repository.session.commit()
            await self.repository.session.refresh(product)
            return product
        except Exception:
            await self.repository.session.rollback()
            raise

    async def delete(self, product_id: int) -> Product:
        product = await self.get_by_id(product_id)

        try:
            await self.repository.delete(product)
            await self.repository.session.commit()
            return product
        except Exception:
            await self.repository.session.rollback()
            raise

    async def activate(self, product_id: int) -> Product:
        product = await self.get_by_id(product_id)

        try:
            await self.repository.activate(product)
            await self.repository.session.commit()
            await self.repository.session.refresh(product)
            return product
        except Exception:
            await self.repository.session.rollback()
            raise

    async def deactivate(self, product_id: int) -> Product:
        product = await self.get_by_id(product_id)

        try:
            await self.repository.deactivate(product)
            await self.repository.session.commit()
            await self.repository.session.refresh(product)
            return product
        except Exception:
            await self.repository.session.rollback()
            raise

    async def update_stock(self, product_id: int, quantity: int) -> Product:
        if quantity <= 0:
            raise ValidationException(
                'Количество должно быть положительным.'
            )

        product = await self.get_by_id(product_id)

        try:
            await self.repository.update_stock(product, quantity)
            await self.repository.session.commit()
            await self.repository.session.refresh(product)
            return product
        except Exception:
            await self.repository.session.rollback()
            raise

    async def decrease_stock(self, product_id: int, quantity: int) -> Product:
        if quantity <= 0:
            raise ValidationException(
                'Количество должно быть положительным.'
            )
        product = await self.repository.get_by_id_for_update(product_id)
        if not product:
            raise NotFoundException(PRODUCT_NOT_FOUND_MSG)

        if product.stock < quantity:
            raise ValidationException(
                'Недостаточно товара.'
            )

        product.stock -= quantity

        try:
            await self.repository.session.commit()
            await self.repository.session.refresh(product)
            return product
        except Exception:
            await self.repository.session.rollback()
            raise


