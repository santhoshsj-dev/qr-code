// src/components/layout/Footer.tsx
import React from "react";

// Minimal footer with privacy + version info.
const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted">
        <span>Runs entirely on your device. No data is stored.</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            View on GitHub
          </a>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
