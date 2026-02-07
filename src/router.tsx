// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";

// Router with a shared layout shell.
// Children pages render into <Outlet /> inside PageLayout.[web:23][web:28]
export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
