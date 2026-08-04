import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/products/:id",
                element: <ProductPage />,
            },
            {
                path: "/cart",
                element: <CartPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);