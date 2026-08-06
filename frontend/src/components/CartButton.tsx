import {ShoppingCart} from "lucide-react";

function CartButton() {
    return (
        <button className="rounded-lg bg-[#FFA500] px-5 py-2 font-semibold text-white transition hover:bg-[#FF8C00]">
            <ShoppingCart size={18} /> Корзина
        </button>
    );
}

export default CartButton;