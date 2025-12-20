// src/components/layout/Header.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

// Simple sticky header with app title and optional reset.
const Header: React.FC = () => {
  const location = useLocation();

  const handleReset = () => {
    // For now a simple full-page reload.
    // Later you can wire this to clear context / state only.
    window.location.reload();
  };

  return (
    <header className="site-header sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Left: logo + tagline */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md brand-gradient" />
            <div>
              <div className="text-sm font-semibold tracking-tight">
                Static QR Studio
              </div>
              <div className="text-[11px] text-muted">
                Runs 100% in your browser
              </div>
            </div>
          </Link>
        </div>

        {/* Center: nav (optional) */}
        <nav className="hidden md:flex items-center gap-4 text-xs">
          <Link
            to="/"
            className={
              location.pathname === "/"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Generator
          </Link>
          <Link
            to="/bulk"
            className={
              location.pathname.startsWith("/bulk")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Bulk
          </Link>
          <Link
            to="/help"
            className={
              location.pathname.startsWith("/help")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Help
          </Link>
          <Link
            to="/about"
            className={
              location.pathname.startsWith("/about")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            About
          </Link>
        </nav>

        {/* Right: Reset + privacy tooltip icon */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={handleReset}
            className="hidden sm:inline-flex btn-ghost"
          >
            Reset
          </button>

          {/* Privacy tooltip – later replace with a real tooltip component */}
          <div className="relative group">
            <button
              aria-label="Privacy info"
              className="h-7 w-7 rounded-full btn-ghost flex items-center justify-center"
            >
              i
            </button>
            <div className="pointer-events-none absolute right-0 mt-2 w-64 rounded panel p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              No tracking, no uploads, no backend. Everything runs locally in
              your browser.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
