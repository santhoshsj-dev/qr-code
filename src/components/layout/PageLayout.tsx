// src/components/layout/PageLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";


// App shell: header → main content → footer.
// Wraps a max-width container and responsive grid (page-specific).
const PageLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky header with logo + tagline */}
      <Header />

      {/* Main content area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Minimal footer */}
      <Footer />
   
    </div>
  );
};

export default PageLayout;
