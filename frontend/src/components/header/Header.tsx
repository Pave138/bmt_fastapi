import Logo from "../Logo.tsx";
import Search from "./Search.tsx";
import CartButton from "../CartButton.tsx";

function Header() {
    return (
        <header className="border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
                <Logo />

                <Search />

                <nav className="ml-auto flex items-center gap-6">
                    <a href="#">Каталог</a>
                    <a href="#">Акции</a>
                    <a href="#">Контакты</a>

                    <CartButton />
                </nav>
            </div>
        </header>
    );
}

export default Header;