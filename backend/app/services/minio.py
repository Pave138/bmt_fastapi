from datetime import timedelta
from io import BytesIO

from minio import Minio

from app.core.config import settings

minio_client = Minio(
    'localhost:9000',
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False
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
    ) -> None:
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
            self.backet_name,
            file_key,
            expires=timedelta(hours=12)
        )
