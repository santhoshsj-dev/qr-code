// src/pages/About.tsx
import React from "react";

const About: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 text-xs text-foreground">
      <h1 className="text-lg font-semibold mb-2">About</h1>

      <section className="mb-4 space-y-1">
        <h2 className="text-sm font-semibold">Static architecture</h2>
        <p className="text-[11px] text-slate-300">
          This tool is a static React app built with Vite and TypeScript, hosted
          on a CDN with no backend or database.[web:1][web:4]
        </p>
      </section>

      <section className="mb-4 space-y-1">
        <h2 className="text-sm font-semibold">Privacy first</h2>
        <p className="text-[11px] text-slate-300">
          Every QR is generated directly in your browser. There are no logins,
          analytics beacons, or scan tracking.
        </p>
      </section>

      <section className="space-y-1">
        <h2 className="text-sm font-semibold">Open tooling</h2>
        <p className="text-[11px] text-slate-300">
          The app uses open libraries for QR styling, CSV parsing, and ZIP
          creation, all running client‑side.[web:13][web:19][web:26]
        </p>
      </section>
    </div>
  );
};

export default About;
