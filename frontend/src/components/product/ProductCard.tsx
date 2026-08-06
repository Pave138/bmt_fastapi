import {
    Heart,
    ShoppingCart,
    Star,
} from "lucide-react";


import { formatPrice } from "../../utils/formatPrice";

import type { Product } from "../../types/Product";


interface Props {
    product: Product;
}


function ProductCard({
    product,
}: Props) {


    const hasDiscount =
        product.old_price &&
        Number(product.old_price) > Number(product.price);


    const discount = hasDiscount
        ? Math.round(
              (
                  1 -
                  Number(product.price) /
                  Number(product.old_price)
              ) * 100
          )
        : null;



    return (

        <div
            className="
                group
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
            "
        >

            <div
                className="
                    relative
                "
            >

                {
                    hasDiscount && (
                        <span
                            className="
                                absolute
                                left-3
                                top-3
                                z-10
                                rounded-lg
                                bg-red-500
                                px-2
                                py-1
                                text-xs
                                font-semibold
                                text-white
                            "
                        >
                            -{discount}%
                        </span>
                    )
                }



                <button
                    className="
                        absolute
                        right-3
                        top-3
                        z-10
                        rounded-full
                        bg-white
                        p-2
                        shadow
                        transition
                        hover:text-red-500
                    "
                >
                    <Heart size={18}/>
                </button>



                <div
                    className="
                        aspect-[4/3]
                        overflow-hidden
                        bg-gray-100
                    "
                >

                    {
                        product.main_image ? (

                            <img
                                src={
                                    product.main_image.image_url
                                }
                                alt={
                                    product.name
                                }
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-300
                                    group-hover:scale-105
                                "
                            />

                        ) : (

                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                    text-gray-400
                                "
                            >
                                Нет изображения
                            </div>

                        )
                    }

                </div>


            </div>



            <div
                className="
                    space-y-3
                    p-5
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-1
                        text-sm
                        text-gray-500
                    "
                >

                    <Star
                        size={15}
                        className="
                            fill-yellow-400
                            text-yellow-400
                        "
                    />

                    <span>
                        {product.avg_rating.toFixed(1)}
                    </span>

                    <span>
                        ({product.reviews_count})
                    </span>

                </div>



                <h3
                    className="
                        line-clamp-2
                        min-h-[56px]
                        text-base
                        font-semibold
                    "
                >
                    {product.name}
                </h3>



                <p
                    className="
                        text-sm
                        font-medium
                        text-green-600
                    "
                >
                    ✓ В наличии
                </p>



                <div
                    className="
                        flex
                        items-end
                        gap-2
                    "
                >

                    {
                        hasDiscount && (
                            <span
                                className="
                                    text-sm
                                    text-gray-400
                                    line-through
                                "
                            >
                                {
                                    formatPrice(
                                        product.old_price!
                                    )
                                } ₽
                            </span>
                        )
                    }


                    <span
                        className="
                            text-2xl
                            font-bold
                            text-[#FFA500]
                        "
                    >
                        {
                            formatPrice(
                                product.price
                            )
                        } ₽
                    </span>


                </div>



                <button
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#FFA500]
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-orange-600
                    "
                >

                    <ShoppingCart size={18}/>

                    В корзину

                </button>


            </div>


        </div>

    );
}


export default ProductCard;