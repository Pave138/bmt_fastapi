import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from "react-router-dom";

import { router } from "./router";

import './index.css'

import { QueryClientProvider} from "@tanstack/react-query";

import { queryClient } from "./lib/react-query";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
  </StrictMode>,
)
