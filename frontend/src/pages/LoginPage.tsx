import {
    FormEvent,
    useState,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(
                username,
                password
            );

            const from =
                location.state?.from?.pathname ??
                "/";

            navigate(from, {
                replace: true,
            });
        } catch (error) {
            console.error(error);

            setError(
                "Неверный логин или пароль"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold">
                    Вход
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium"
                        >
                            Логин
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                            required
                            autoComplete="username"
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-orange-500
                                focus:ring-2
                                focus:ring-orange-200
                            "
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium"
                        >
                            Пароль
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                            autoComplete="current-password"
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-orange-500
                                focus:ring-2
                                focus:ring-orange-200
                            "
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            rounded-lg
                            bg-orange-500
                            px-4
                            py-3
                            font-medium
                            text-white
                            transition
                            hover:bg-orange-600
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Вход..."
                            : "Войти"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Нет аккаунта?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-orange-600 hover:text-orange-700"
                    >
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;