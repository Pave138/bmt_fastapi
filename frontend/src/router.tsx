import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router =
    createBrowserRouter([
        {
            element: <MainLayout />,
            children: [
                {
                    path: "/",
                    element: <CatalogPage />,
                },
                {
                    path: "/products/:slug",
                    element: <ProductPage />,
                },
                {
                    path: "/cart",
                    element: <CartPage />,
                },
                {
                    path: "/login",
                    element: <LoginPage />,
                },
                {
                    path: "/register",
                    element: <RegisterPage />,
                },
            ],
        },
        {
            path: "*",
            element: <NotFoundPage />,
        },
    ]);