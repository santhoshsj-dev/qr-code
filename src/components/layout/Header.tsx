// src/components/layout/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

// Simple sticky header with app title.
const Header: React.FC = () => {
  return (
    <header className="site-header sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Left: logo + tagline */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 ">
             <img src="/src/assets/saas-logo.svg" alt="QR Icon" className="h-full w-full object-cover rounded-md" />
              </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">
                QR Code Generator
              </div>
              <div className="text-[11px] text-muted">
                Runs 100% in your browser
              </div>
            </div>
          </Link>
        </div>

        {/* Right: GitHub star + theme toggle + privacy tooltip icon */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/santhoshsj-dev/qr-code"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded btn-ghost text-[11px]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20.5 7.3 14 2.5 9.4l6.6-.9L12 2.5z"
              />
            </svg>
            Star on GitHub
          </a>

          <ThemeToggle />

          {/* Privacy tooltip - later replace with a real tooltip component */}
          <div className="relative group hidden sm:inline-flex">
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
