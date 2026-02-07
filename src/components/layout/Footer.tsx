// src/components/layout/Footer.tsx
import React from "react";

// Minimal footer with attribution.
const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-center text-[11px] text-muted">
        <a
          href="http://sansdot.framer.website/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          Developed by Sans.
        </a>
      </div>
    </footer>
  );
};

export default Footer;
