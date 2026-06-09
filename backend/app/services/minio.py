from minio import Minio

from app.core.config import settings

minio_client = Minio(
    'localhost:9000',
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False
)

BACKET_NAME = 'uploads'

if not minio_client.bucket_exists(BACKET_NAME):
    minio_client.make_bucket(BACKET_NAME)

