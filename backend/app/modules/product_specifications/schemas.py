from pydantic import BaseModel, ConfigDict, Field

from app.core.constants import (
    PRODUCT_SPECIFICATION_NAME_MAX_LENGTH,
    PRODUCT_SPECIFICATION_VALUE_MAX_LENGTH,
)


class SpecFields(BaseModel):
    name: str = Field(max_length=PRODUCT_SPECIFICATION_NAME_MAX_LENGTH)
    value: str = Field(max_length=PRODUCT_SPECIFICATION_VALUE_MAX_LENGTH)


class SpecCreate(SpecFields):
    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'name': 'Мощность',
                'value': '6 л.с.'
            }
        }
    )


class SpecUpdate(BaseModel):
    name: str | None = Field(
        None,
        max_length=PRODUCT_SPECIFICATION_NAME_MAX_LENGTH
    )
    value: str | None = Field(
        None,
        max_length=PRODUCT_SPECIFICATION_VALUE_MAX_LENGTH
    )


class SpecResponse(SpecFields):
    model_config = ConfigDict(from_attributes=True)


class SpecDB(SpecResponse):
    id: int
