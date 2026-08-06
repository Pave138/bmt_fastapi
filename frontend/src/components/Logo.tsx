import logo from "../assets/logo.svg";

function Logo() {
    return (
        <a
            href="/"
            className="flex items-center gap-3 shrink-0"
        >
            <img
                src={logo}
                alt="БензоМотоТек"
                className="h-12 w-auto"
            />

            <div>
                <h1 className="text-xl font-bold text-green-700">
                    БензоМотоТек
                </h1>

                <p className="text-sm text-gray-500">
                    Интернет-магазин техники
                </p>
            </div>
        </a>
    );
}

export default Logo;