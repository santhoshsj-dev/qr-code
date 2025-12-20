// src/App.tsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

// App just renders the router.
// All page structure is handled via routes and PageLayout.
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
