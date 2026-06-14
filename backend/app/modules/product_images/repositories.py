from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import ProductImage


class ProductImageRepository:

    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

    async def create(
        self,
        **data
    ) -> ProductImage:
        image = ProductImage(
            **data
        )

        self.session.add(image)
        await self.session.flush()

        return image

    async def get_by_id(
        self,
        image_id: int
    ) -> ProductImage | None:
        result = await self.session.execute(
            select(ProductImage)
            .where(
                ProductImage.id == image_id
            )
        )
        return result.scalar_one_or_none()

    async def get_product_images(
        self,
        product_id: int
    ) -> list[ProductImage]:
        result = await self.session.execute(
            select(ProductImage)
            .where(ProductImage.product_id == product_id)
            .order_by(ProductImage.is_main.desc())
        )
        return result.scalars().all()

    async def unset_main(
        self,
        product_id: int
    ) -> None:
        result = await self.session.execute(
            select(ProductImage)
            .where(
                ProductImage.product_id == product_id,
                ProductImage.is_main.is_(True)
            )
        )

        for image in result.scalars():
            image.is_main = False

    async def delete(
        self,
        image: ProductImage
    ) -> None:
        await self.session.delete(image)
