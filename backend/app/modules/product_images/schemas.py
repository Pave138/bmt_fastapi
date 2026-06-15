from pydantic import BaseModel, ConfigDict


class ProductImageDB(BaseModel):
    id: int
    product_id: int

    original_filename: str
    content_type: str

    file_size: int

    width: int | None
    height: int | None

    is_main: bool

    model_config = ConfigDict(
        from_attributes=True
    )


class ProductImageResponse(ProductImageDB):
    image_url: str
