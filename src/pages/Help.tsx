// src/pages/Help.tsx
import React from "react";

const Help: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 text-xs text-foreground">
      <h1 className="text-lg font-semibold mb-2">Help</h1>

      <section className="mb-4 space-y-1">
        <h2 className="text-sm font-semibold">How to create a QR</h2>
        <p className="text-[11px] text-slate-300">
          Choose a QR type, fill in the fields, customize colors and size, then
          click “Download QR”.
        </p>
      </section>

      <section className="mb-4 space-y-1">
        <h2 className="text-sm font-semibold">What data is stored?</h2>
        <p className="text-[11px] text-slate-300">
          No QR content or files ever leave your device. There is no server,
          account, or tracking.
        </p>
      </section>

      <section className="space-y-1">
        <h2 className="text-sm font-semibold">Bulk CSV format</h2>
        <p className="text-[11px] text-slate-300">
          Use one row per QR with columns like type, value, and any extra
          fields such as email or phone, depending on the QR template.
        </p>
      </section>
    </div>
  );
};

export default Help;
