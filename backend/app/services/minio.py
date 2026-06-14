from datetime import timedelta
from io import BytesIO
from typing import Annotated

from fastapi import Depends
from minio import Minio

from app.core.config import settings

minio_client = Minio(
    endpoint=settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=(settings.MINIO_SECURE == 'True')
)


class MinioService:
    def __init__(
        self,
        client: Minio,
        bucket_name: str
    ):
        self.client = client
        self.bucket_name = bucket_name

    def upload(
        self,
        file_key: str,
        data: bytes,
        content_type: str
    ) -> str:
        self.client.put_object(
            bucket_name=self.bucket_name,
            object_name=file_key,
            data=BytesIO(data),
            length=len(data),
            content_type=content_type
        )
        return file_key

    def remove(
        self,
        file_key: str
    ) -> None:
        self.client.remove_object(
            self.bucket_name,
            file_key
        )

    def get_url(
        self,
        file_key: str
    ) -> str:
        return self.client.presigned_get_object(
            self.bucket_name,
            file_key,
            expires=timedelta(hours=12)
        )


def get_minio_service() -> MinioService:
    return MinioService(
        client=minio_client,
        bucket_name=settings.MINIO_BUCKET_NAME
    )


MinioServiceDep = Annotated[
    MinioService,
    Depends(get_minio_service)
]
