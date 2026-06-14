from pydantic import BaseModel, ConfigDict


class ProductImageResponse(BaseModel):
    id: int
    product_id: int

    file_key: str
    original_filename: str
    content_type: str

    file_size: int

    width: int | None
    height: int | None

    is_main: bool
    image_url: str

    model_config = ConfigDict(
        from_attributes=True
    )


class ProductImageUploadResponse(ProductImageResponse):
    pass
