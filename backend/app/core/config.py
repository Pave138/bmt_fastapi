"""Настройки приложения."""

from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.constants import APP_TITLE


class Settings(BaseSettings):
    """Настройки из переменных окружения."""

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )

    APP_TITLE: str = APP_TITLE
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_LIFETIME: int = 60 * 60

    ORIGINS: str

    REDIS_URL: str

    MINIO_BUCKET_NAME: str
    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str
    MINIO_SECURE: str


settings = Settings()
