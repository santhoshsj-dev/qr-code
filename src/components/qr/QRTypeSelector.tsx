// src/components/qr/QRTypeSelector.tsx
import React from "react";
import type { QRType } from "../../pages/Home";

interface QRTypeSelectorProps {
  value: QRType;
  onChange: (type: QRType) => void;
}

// Tab-based QR type selector with nested social selector included.
const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ value, onChange }) => {
  const tabs: { id: QRType; label: string }[] = [
    { id: "url", label: "URL" },
    { id: "text", label: "Text" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "vcard", label: "vCard" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "social", label: "Social links" },
  ];

  return (
    <div className="panel p-1 text-[11px]">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const active = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "rounded px-2.5 py-1",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-slate-200 hover:bg-slate-800",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QRTypeSelector;
