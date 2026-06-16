from io import BytesIO
from uuid import uuid4

from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError
from sqlalchemy.exc import IntegrityError

from app.core.constants import (
    PRODUCT_IMAGE_ALLOWED_TYPES,
    PRODUCT_IMAGE_MAX_SIZE,
    PRODUCT_NOT_FOUND_MSG,
)
from app.core.exceptions import (
    ConflictException,
    NotFoundException,
    ValidationException,
)
from app.modules.products.repositories import ProductRepository
from app.services.cache.service import CacheService
from app.services.minio import MinioService

from .repositories import ProductImageRepository
from .schemas import ProductImageDB, ProductImageResponse


class ProductImageService:

    def __init__(
        self,
        product_repository: ProductRepository,
        image_repository: ProductImageRepository,
        minio_service: MinioService,
        cache_service: CacheService
    ):
        self.product_repository = product_repository
        self.image_repository = image_repository
        self.minio_service = minio_service
        self.cache_service = cache_service

    async def upload_image(
        self,
        product_id: int,
        file: UploadFile,
        is_main: bool = False
    ):
        product = await self.product_repository.get_by_id(
            product_id
        )

        if not product:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        if file.content_type not in PRODUCT_IMAGE_ALLOWED_TYPES:
            raise ValidationException(
                'Неподдерживаемый тип изображения'
            )

        content = await file.read()

        if len(content) > PRODUCT_IMAGE_MAX_SIZE:
            raise ValidationException(
                'Изображение слишком большое'
            )

        image = Image.open(
            BytesIO(content)
        )

        width, height = image.size

        extension = file.filename.split('.')[-1]

        file_key = f'{product_id}/{uuid4()}.{extension}'

        self.minio_service.upload(
            file_key=file_key,
            data=content,
            content_type=file.content_type
        )

        try:
            if is_main:
                await self.image_repository.unset_main(
                    product_id
                )

            db_image = await self.image_repository.create(
                product_id=product_id,
                file_key=file_key,

                original_filename=file.filename,
                content_type=file.content_type,

                file_size=len(content),

                width=width,
                height=height,
                is_main=is_main
            )

            await self.image_repository.session.commit()
            await self.image_repository.session.refresh(
                db_image
            )
            await self.cache_service.invalidate_product_cache()

            db_data = ProductImageDB.model_validate(
                db_image
            )

            return ProductImageResponse(
                **db_data.model_dump(),
                image_url=self.minio_service.get_url(
                    db_image.file_key
                )
            )

        except UnidentifiedImageError:
            raise ValidationException(
                'Файл не является изображением'
            )
        except IntegrityError:
            await self.image_repository.session.rollback()
            self.minio_service.remove(
                file_key
            )
            raise ConflictException(
                'Изображение существует'
            )

    async def delete_image(
        self,
        image_id: int
    ):
        image = await self.image_repository.get_by_id(
            image_id
        )

        if not image:
            raise NotFoundException(
                'Изображение не найдено'
            )

        self.minio_service.remove(
            image.file_key
        )

        await self.image_repository.delete(
            image
        )

        await self.image_repository.session.commit()
        await self.cache_service.invalidate_product_cache()

    async def get_product_images(
        self,
        product_id: int
    ) -> list[ProductImageResponse]:

        images = await self.image_repository.get_product_images(
            product_id
        )

        return [
            ProductImageResponse(
                **img.__dict__,
                image_url=self.minio_service.get_url(
                    img.file_key
                )
            )
            for img in images
        ]

    async def set_main_image(
        self,
        image_id: int
    ) -> ProductImageResponse:

        image = await self.image_repository.get_by_id(
            image_id
        )

        if not image:
            raise NotFoundException(
                'Изображение не найдено'
            )

        await self.image_repository.unset_main(
            image.product_id
        )

        image.is_main = True

        await self.image_repository.session.commit()
        await self.image_repository.session.refresh(
            image
        )
        await self.cache_service.invalidate_product_cache()
        return ProductImageResponse(
            **image.__dict__,
            image_url=self.minio_service.get_url(
                image.file_key
            )
        )
