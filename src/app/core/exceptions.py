class AppException(Exception):
    """Базовое исключение приложения."""


class NotFoundException(AppException):
    """Ресурс не найден."""


class ConflictException(AppException):
    """Конфликт данных."""


class UnauthorizedException(AppException):
    """Пользователь не авторизован."""


class ForbiddenException(AppException):
    """Недостаточно прав."""


class ValidationException(AppException):
    """Ошибка валидации."""
