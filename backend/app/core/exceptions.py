from fastapi import HTTPException, status
from typing import Any, Dict, Optional


class AppException(HTTPException):
    """Базовое исключение приложения."""

    def __init__(
            self,
            status_code: int,
            detail: str,
            headers: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            status_code=status_code,
            detail=detail,
            headers=headers
        )


class NotFoundException(AppException):
    """Ресурс не найден."""

    def __init__(self, detail: str = "Ресурс не найден"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )


class ConflictException(AppException):
    """Конфликт данных."""

    def __init__(self, detail: str = "Конфликт данных"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail
        )


class UnauthorizedException(AppException):
    """Пользователь не авторизован."""

    def __init__(self, detail: str = "Не авторизован"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"}
        )


class ForbiddenException(AppException):
    """Недостаточно прав."""

    def __init__(self, detail: str = "Доступ запрещен"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail
        )


class ValidationException(AppException):
    """Ошибка валидации."""

    def __init__(self, detail: str = "Ошибка валидации"):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail
        )


class BadRequestException(AppException):
    """Некорректный запрос."""

    def __init__(self, detail: str = "Некорректный запрос"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )


class DatabaseException(AppException):
    """Ошибка базы данных."""

    def __init__(self, detail: str = "Ошибка базы данных"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail
        )