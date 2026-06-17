from app.core.constants import (
    PRODUCT_NOT_FOUND_MSG,
    PRODUCT_SPECIFICATION_NOT_FOUND_MSG,
)
from app.core.exceptions import NotFoundException
from app.modules.products.repositories import ProductRepository
from app.services.base_service import BaseService
from app.services.cache.service import CacheService

from .repositories import ProductSpecificationRepository
from .schemas import SpecCreate, SpecResponse, SpecUpdate


class ProductSpecificationService(BaseService):
    def __init__(
        self,
        repository: ProductSpecificationRepository,
        product_repository: ProductRepository,
        cache_service: CacheService
    ):
        self.repository = repository
        self.product_repository = product_repository
        self.cache_service = cache_service
        
    async def create(
        self,
        product_id: int,
        data: SpecCreate
    ) -> SpecResponse:
        if not await self.product_repository.exists_by_id(product_id):
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        spec = await self.repository.create({
            **data.model_dump()
        })
        await self.repository.session.commit()
        await self.cache_service.invalidate_product_cache()
        
        return SpecResponse.model_validate(spec)
    
    async def get_by_product_id(
        self,
        product_id: int
    ) -> list[SpecResponse]:
        if not await self.product_repository.exists_by_id(product_id):
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )
        
        specs = await self.repository.get_product_spec(product_id)
        
        response = [
            SpecResponse.model_validate(spec)
            for spec in specs
        ]
        
        return response
    
    async def update(
        self,
        spec_id: int,
        data: SpecUpdate
    ) -> SpecResponse:
        spec = await self.repository.get_by_id(spec_id)
        
        if not spec:
            raise NotFoundException(
                PRODUCT_SPECIFICATION_NOT_FOUND_MSG
            )

        update_data = data.model_dump(exclude_unset=True)

        result = await self.update_model(
            spec,
            update_data,
            self.repository.session
        )

        await self.cache_service.invalidate_product_cache()

        return result

    async def delete(self, spec_id: int) -> None:
        spec = await self.repository.get_by_id(spec_id)

        if not spec:
            raise NotFoundException(
                PRODUCT_SPECIFICATION_NOT_FOUND_MSG
            )

        try:
            await self.repository.delete(spec)
            await self.repository.session.commit()

            await self.cache_service.invalidate_product_cache()

        except Exception:
            await self.repository.session.rollback()

            raise
