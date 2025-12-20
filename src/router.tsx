// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout.tsx";
import Home from "./pages/Home.tsx";
import Bulk from "./pages/Bulk.tsx";
import Help from "./pages/Help.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";

// Router with a shared layout shell.
// Children pages render into <Outlet /> inside PageLayout.[web:23][web:28]
export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "bulk", element: <Bulk /> },
      { path: "help", element: <Help /> },
      { path: "about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
