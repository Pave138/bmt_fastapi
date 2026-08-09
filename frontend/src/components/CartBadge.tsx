import { Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";

export default function CartBadge() {
    const {
        cart,
        isLoading,
    } = useCart();

    const totalItems =
        cart?.total_items ?? 0;

    return (
        <Link
            to="/cart"
            className="
                relative
                flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                transition
                hover:bg-gray-100
            "
        >
            <span>
                Корзина
            </span>

            {!isLoading && totalItems > 0 && (
                <span
                    className="
                        flex
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-black
                        px-1.5
                        py-0.5
                        text-xs
                        font-medium
                        text-white
                    "
                >
                    {totalItems}
                </span>
            )}
        </Link>
    );
}