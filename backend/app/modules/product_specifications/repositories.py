from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import ProductSpecification


class ProductSpecificationRepository:
    def __init__(
            self,
            session: AsyncSession
    ):
        self.session = session

    async def create(
        self,
        data: dict
    ) -> ProductSpecification:
        spec = ProductSpecification(
            **data
        )

        self.session.add(spec)
        await self.session.flush()

        return spec

    async def get_by_id(
        self,
        spec_id: int
    ) -> ProductSpecification | None:
        result = await self.session.execute(
            select(ProductSpecification)
            .where(ProductSpecification.id == spec_id)
        )
        return result.scalar_one_or_none()

    async def get_product_spec(
        self,
        product_id: int
    ) -> list[ProductSpecification]:
        result = await self.session.execute(
            select(ProductSpecification)
            .where(ProductSpecification.product_id == product_id)
        )

        return result.scalars().all()

    async def delete(self, spec: ProductSpecification) -> None:
        await self.session.delete(spec)
