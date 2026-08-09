import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";

import { router } from "./router";
import { queryClient } from "./lib/react-query";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import "./index.css";

createRoot(
    document.getElementById("root")!
).render(
    <StrictMode>
        <QueryClientProvider
            client={queryClient}
        >
            <AuthProvider>
                <CartProvider>
                    <RouterProvider
                        router={router}
                    />
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
);