// src/components/layout/Footer.tsx
import React from "react";

// Minimal footer with attribution.
const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-6xl px-4 py-3 flex sm:flex-row items-center justify-between gap-3 text-[11px] text-muted">
        <a
          href="http://sansdot.framer.website/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          Developed by Sans.
        </a>
        <a
          href="https://forms.gle/7UcvuNPhxZyAisUU8"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground px-2 py-1 rounded outline outline-muted hover:outline-foreground transition"
        >
          Feedback submit form
        </a>
      </div>
    </footer>
  );
};

export default Footer;
