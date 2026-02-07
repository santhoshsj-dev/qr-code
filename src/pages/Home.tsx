// src/pages/Home.tsx
import React, { useState } from "react";
import QRTypeSelector from "../components/qr/QRTypeSelector";
import QRGenerator from "../components/qr/QRGenerator";
import QRCustomizer from "../components/qr/QRCustomizer";
import QRPreview from "../components/qr/QRPreview";
import QRDownload from "../components/qr/QRDownload";
import BulkModal from "../components/bulk/BulkModal";

// Enum for QR content types.
export type QRType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "whatsapp";

// Basic shape of current QR config in page state.
// In the real app, you'll likely centralize this in a hook/context.
export interface QRSettings {
  type: QRType;
  data: Record<string, string>; // per-type fields (url, email, etc.)
  size: number;
  format: "png" | "svg" | "jpeg";
  style?: {
    dotsColor?: string;
    backgroundColor?: string;
    dotsType?: "rounded" | "square";
    image?: string | null;
    imageSize?: number; // percent (5..50)
    imagePixelSize?: number; // optional pixel size override
    cornerType?: "sharp" | "rounded";
    eyeType?: "classic" | "rounded";
    margin?: number; // padding around QR in px
  };
}

const Home: React.FC = () => {
  // Top-level QR state (very simple placeholder for now).
  const [settings, setSettings] = useState<QRSettings>({
    type: "url",
    data: {} as Record<string, string>,
    size: 512,
    format: "png",
    style: {
      dotsColor: "#000000",
      backgroundColor: "#ffffff",
      dotsType: "square",
      image: null,
      imageSize: 20,
      cornerType: "sharp",
      eyeType: "classic",
      margin: 10,
    },
  });

  const qrInstanceRef = React.useRef<unknown | null>(null);

  const [isBulkOpen, setBulkOpen] = useState(false);

  // Handler to change QR type from the selector.
  const handleTypeChange = (type: QRType) => {
    setSettings((prev) => ({
      ...prev,
      type,
      data: {}, // optionally reset data when type changes
    }));
  };

  // Handler for individual form fields.
  const handleDataChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }));
  };

  // Handler for size slider.
  const handleSizeChange = (size: number) => {
    setSettings((prev) => ({
      ...prev,
      size,
    }));
  };

  // Handler for output format selection.
  const handleFormatChange = (format: "png" | "svg" | "jpeg") => {
    setSettings((prev) => ({
      ...prev,
      format,
    }));
  };

  // Handler for style changes (color, shape, logo image)
  const handleStyleChange = (key: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      style: {
        ...(prev.style || {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key]: value as any,
      },
    }));
  };

  const isEmpty = Object.values(settings.data).every(
    (value) => value?.trim?.() === ""
  );

  // Basic validation rules per type. Returns true if invalid.
  const validateSettings = (s: QRSettings) => {
    const v = s.data || {};
    const notBlank = (v: string | undefined) => (v || "").trim() !== "";

    switch (s.type) {
      case "url": {
        const url = v.url || "";
        if (!notBlank(url)) return false; // empty handled by isEmpty
        try {
          new URL(url);
          return false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          return true;
        }
      }
      case "email": {
        const addr = v.email || "";
        if (!notBlank(addr)) return false;
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
        return !ok;
      }
      case "phone": {
        const num = (v.phone || "").replace(/\D/g, "");
        if (!num) return false;
        return num.length < 6;
      }
      case "whatsapp": {
        const num = (v.phone || "").replace(/\D/g, "");
        if (!num) return false;
        return num.length < 6;
      }
      default:
        return false;
    }
  };

  const isInvalid = validateSettings(settings);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Page‑level heading + bulk trigger */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Static QR Generator
          </h1>
          <p className="text-xs text-muted">
            Create fully static, privacy‑friendly QR codes with custom colors,
            logos and more.
          </p>
        </div>
        <button
          onClick={() => setBulkOpen(true)}
          className="inline-flex items-center gap-1 rounded btn-ghost text-xs hover:opacity-95"
        >
          Bulk generate (CSV)
        </button>
      </div>

      {/* Responsive grid: left = controls, right = preview */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Left: Inputs & customization */}
        <section className="space-y-4">
          {/* 1. Type selector (tabs) */}
          <QRTypeSelector
            value={settings.type}
            onChange={handleTypeChange}
          />

          {/* 2. Dynamic input forms per type */}
          <div className="panel space-y-3">
            <QRGenerator
              type={settings.type}
              data={settings.data}
              onChangeField={handleDataChange}
            />
          </div>

          {/* 3. Customization collapsible panel */}
          <QRCustomizer
            size={settings.size}
            onSizeChange={handleSizeChange}
            style={settings.style}
            onStyleChange={handleStyleChange}
          />
        </section>

        {/* Right: Preview & download */}
        <section className="space-y-4">
          {/* Preview card */}
          <QRPreview
            settings={settings}
            isEmpty={isEmpty}
            qrInstanceRef={qrInstanceRef}
          />

          {/* Size + format info + download */}
          <QRDownload
            settings={settings}
            disabled={isEmpty || isInvalid}
            onFormatChange={handleFormatChange}
            qrInstanceRef={qrInstanceRef}
          />
        </section>
      </div>

      {/* Bulk modal / slide‑over */}
      {isBulkOpen && <BulkModal onClose={() => setBulkOpen(false)} />}
    </div>
  );
};

export default Home;
