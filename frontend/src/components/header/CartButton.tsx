import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function CartButton() {
    return (
        <Link
            to="/cart"
            className="
                flex
                h-10
                items-center
                gap-2
                rounded-lg
                bg-orange-500
                px-4
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition

                hover:bg-orange-600
                hover:shadow

                focus:outline-none
                focus:ring-2
                focus:ring-orange-300
                focus:ring-offset-2

                active:scale-[0.98]
            "
        >
            <ShoppingCart size={18} strokeWidth={2} />

            <span>
                Корзина
            </span>
        </Link>
    );
}

export default CartButton;
