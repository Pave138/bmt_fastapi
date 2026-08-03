import Logo from "./Logo";
import Search from "./Search";
import CartButton from "./CartButton";

function Header() {
    return (
        <header className="flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">
            <Logo />

            <Search />

            <CartButton />
        </header>
    );
}

export default Header;