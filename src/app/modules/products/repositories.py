from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Product


class ProductRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self, limit: int, offset: int) -> list[Product]:
        result = await self.session.execute(
            select(Product).offset(offset).limit(limit)
        )
        return result.scalars().all()

    async def get_by_id(self, product_id: int) -> Optional[Product]:
        result = await self.session.execute(
            select(Product).where(Product.id == product_id)
        )
        return result.scalar_one_or_none()

    async def get_all_by_category_id(
        self,
        category_id: int,
        limit: int = 100,
        offset: int = 0
    ) -> list[Product]:
        result = await self.session.execute(
            select(Product).where(
                Product.category_id == category_id
            ).options(
                selectinload(Product.category)
            ).limit(limit).offset(offset)
        )
        return result.scalars().all()

    async def create(self, data: dict) -> Product:
        product = Product(**data)

        self.session.add(product)

        await self.session.flush()

        return product

    async def delete(self, product: Product):
        await self.session.delete(product)
        await self.session.flush()
        return product

    async def exists(self, product_id: int) -> bool:
        result = await self.session.execute(
            select(Product).where(Product.id == product_id)
        )
        return result.scalar_one_or_none() is not None

    async def update_stock(
        self,
        product: Product,
        quantity: int
    ) -> Product:
        product.stock = quantity
        await self.session.flush()
        return product

    async def activate(self, product: Product) -> Product:
        product.is_active = True
        await self.session.flush()
        return product

    async def get_by_id_for_update(self, product_id: int) -> Optional[Product]:
        result = self.session.execute(
            select(Product).where(
                Product.id == product_id
            ).with_for_update()
        )
        return result.scalar_one_or_none()

    async def deactivate(self, product: Product) -> Product:
        product.is_active = False
        await self.session.flush()
        return product