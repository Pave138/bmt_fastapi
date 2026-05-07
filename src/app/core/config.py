"""Настройки приложения."""

from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.constants import APP_TITLE, DATABASE_URL


class Settings(BaseSettings):
    """Настройки из переменных окружения."""

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )

    APP_TITLE: str = APP_TITLE
    DATABASE_URL: str = DATABASE_URL
    JWT_SECRET_KEY: str
    JWT_LIFETIME: int = 60 * 60


settings = Settings()
