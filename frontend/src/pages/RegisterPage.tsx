import {
    FormEvent,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { register } from "../api/auth";

function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [passwordConfirm, setPasswordConfirm] =
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

        if (password !== passwordConfirm) {
            setError(
                "Пароли не совпадают"
            );

            return;
        }

        setLoading(true);

        try {
            await register({
                username,
                email,
                password,
            });

            navigate("/login", {
                replace: true,
            });
        } catch (error: any) {
            console.error(error);

            const detail =
                error?.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(
                    detail
                        .map(
                            (item) =>
                                item.msg
                        )
                        .join(", ")
                );
            } else if (
                typeof detail === "string"
            ) {
                setError(detail);
            } else {
                setError(
                    "Не удалось зарегистрироваться"
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold">
                    Регистрация
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
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                            autoComplete="email"
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
                            minLength={8}
                            autoComplete="new-password"
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
                            htmlFor="passwordConfirm"
                            className="mb-2 block text-sm font-medium"
                        >
                            Повторите пароль
                        </label>

                        <input
                            id="passwordConfirm"
                            type="password"
                            value={passwordConfirm}
                            onChange={(event) =>
                                setPasswordConfirm(
                                    event.target.value
                                )
                            }
                            required
                            minLength={8}
                            autoComplete="new-password"
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
                            ? "Регистрация..."
                            : "Зарегистрироваться"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Уже есть аккаунт?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-orange-600 hover:text-orange-700"
                    >
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;