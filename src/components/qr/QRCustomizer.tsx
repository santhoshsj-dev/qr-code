// src/components/qr/QRCustomizer.tsx
import React from "react";

interface QRCustomizerProps {
  size: number;
  onSizeChange: (size: number) => void;
  style?: {
    dotsColor?: string;
    backgroundColor?: string;
    dotsType?: "rounded" | "square";
    image?: string | null;
    imageSize?: number;
    imagePixelSize?: number;
    cornerType?: "sharp" | "rounded";
    eyeType?: "classic" | "rounded";
    margin?: number;
  };
  onStyleChange?: (key: string, value: unknown) => void;
}

// Customization panel:
// 1) Colors, 2) Logo, 3) Shape styling, 4) Size.
const QRCustomizer: React.FC<QRCustomizerProps> = ({
  size,
  onSizeChange,
  style,
  onStyleChange,
}) => {
  return (
    <div className="space-y-4 text-[11px]">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Colors */}
        <section className="rounded panel">
          <div className="flex w-full items-center justify-between px-3 py-2">
            <span className="font-semibold text-foreground">Colors</span>
          </div>
          <div className="divider-top px-3 py-2 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Foreground</span>
              <input
                type="color"
                value={style?.dotsColor ?? "#000000"}
                onChange={(e) => onStyleChange?.("dotsColor", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Background</span>
              <input
                type="color"
                value={style?.backgroundColor ?? "#ffffff"}
                onChange={(e) => onStyleChange?.("backgroundColor", e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={(style?.backgroundColor ?? "") === "transparent"}
                onChange={(e) => onStyleChange?.("backgroundColor", e.target.checked ? "transparent" : "#ffffff")}
              />
              Transparent background
            </label>
          </div>
        </section>

        {/* Logo upload */}
        <section className="rounded panel">
          <div className="flex w-full items-center justify-between px-3 py-2">
            <span className="font-semibold text-foreground">Logo</span>
          </div>
          <div className="divider-top px-3 py-2 space-y-2">
            <p className="text-[10px] text-muted">Add a centered logo. Small square logos work best.</p>
            <input
              type="file"
              accept="image/*"
              className="text-[11px]"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => onStyleChange?.("image", reader.result as string);
                reader.readAsDataURL(f);
              }}
            />

            {/* Remove logo button + size */}
            {style?.image && (
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => onStyleChange?.("image", null)}
                  className="rounded btn-danger px-2 py-1 text-[11px]"
                >
                  Remove logo
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Logo size</span>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={style?.imageSize ?? 20}
                    onChange={(e) => {
                      const pct = Number(e.target.value);
                      onStyleChange?.("imageSize", pct);
                      // sync pixel size
                      const px = Math.round((pct / 100) * size);
                      onStyleChange?.("imagePixelSize", px);
                    }}
                    className="w-40"
                  />
                  <span className="text-[11px] text-muted">{style?.imageSize ?? 20}%</span>

                  <input
                    type="number"
                    min={8}
                    max={Math.max(64, size)}
                    value={style?.imagePixelSize ?? Math.round(((style?.imageSize ?? 20) / 100) * size)}
                    onChange={(e) => {
                      const px = Math.max(1, Number(e.target.value) || 1);
                      onStyleChange?.("imagePixelSize", px);
                      const pct = Math.round((px / size) * 100);
                      onStyleChange?.("imageSize", pct);
                    }}
                    className="w-20 input text-[11px]"
                  />
                  <span className="text-[11px] text-muted">px</span>
                </div>
              </div>
            )}

            <p className="text-[10px] text-muted">The logo will be auto-resized to keep the QR scannable.</p>
          </div>
        </section>
      </div>

      {/* Shape styling */}
      <section className="rounded panel">
        <div className="flex w-full items-center justify-between px-3 py-2">
          <span className="font-semibold text-foreground">Shapes</span>
        </div>
        <div className="divider-top px-3 py-2">
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="space-y-1">
              <span className="text-muted-foreground">Dot style</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => onStyleChange?.("dotsType", "square")}
                  className={[
                    "flex items-center gap-2 rounded border border-input px-2 py-2 text-[11px]",
                    "hover:opacity-90",
                    style?.dotsType === "square" ? "bg-primary text-primary-foreground" : "bg-transparent",
                  ].join(" ")}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                    <rect x="3" y="3" width="6" height="6" fill="currentColor" />
                    <rect x="13" y="3" width="6" height="6" fill="currentColor" />
                    <rect x="3" y="13" width="6" height="6" fill="currentColor" />
                    <rect x="13" y="13" width="6" height="6" fill="currentColor" />
                  </svg>
                  Square
                </button>
                <button
                  type="button"
                  onClick={() => onStyleChange?.("dotsType", "rounded")}
                  className={[
                    "flex items-center gap-2 rounded border border-input px-2 py-2 text-[11px]",
                    "hover:opacity-90",
                    style?.dotsType === "rounded" ? "bg-primary text-primary-foreground" : "bg-transparent",
                  ].join(" ")}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                    <circle cx="6" cy="6" r="3" fill="currentColor" />
                    <circle cx="16" cy="6" r="3" fill="currentColor" />
                    <circle cx="6" cy="16" r="3" fill="currentColor" />
                    <circle cx="16" cy="16" r="3" fill="currentColor" />
                  </svg>
                  Rounded
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Corner Radius</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => onStyleChange?.("cornerType", "sharp")}
                  className={[
                    "flex items-center gap-2 rounded border border-input px-2 py-2 text-[11px]",
                    "hover:opacity-90",
                    style?.cornerType === "sharp" ? "bg-primary text-primary-foreground" : "bg-transparent",
                  ].join(" ")}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                    <rect x="2.5" y="2.5" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="12.5" y="12.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  Sharp
                </button>
                <button
                  type="button"
                  onClick={() => onStyleChange?.("cornerType", "rounded")}
                  className={[
                    "flex items-center gap-2 rounded border border-input px-2 py-2 text-[11px]",
                    "hover:opacity-90",
                    style?.cornerType === "rounded" ? "bg-primary text-primary-foreground" : "bg-transparent",
                  ].join(" ")}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                    <rect x="2.5" y="2.5" width="8" height="8" rx="2.2" ry="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="12.5" y="12.5" width="7" height="7" rx="1.8" ry="1.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  Rounded
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Eye shape</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => onStyleChange?.("eyeType", "classic")}
                  className={[
                    "flex items-center gap-2 rounded border border-input px-2 py-2 text-[11px]",
                    "hover:opacity-90",
                    style?.eyeType === "classic" ? "bg-primary text-primary-foreground" : "bg-transparent",
                  ].join(" ")}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                    <rect x="2.5" y="2.5" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="7" y="7" width="8" height="8" fill="currentColor" />
                  </svg>
                  Classic
                </button>
                <button
                  type="button"
                  onClick={() => onStyleChange?.("eyeType", "rounded")}
                  className={[
                    "flex items-center gap-2 rounded border border-input px-2 py-2 text-[11px]",
                    "hover:opacity-90",
                    style?.eyeType === "rounded" ? "bg-primary text-primary-foreground" : "bg-transparent",
                  ].join(" ")}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                    <rect x="2.5" y="2.5" width="17" height="17" rx="2.4" ry="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="7" y="7" width="8" height="8" rx="1.6" ry="1.6" fill="currentColor" />
                  </svg>
                  Rounded
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size control (affects export size) */}
      <section className="panel p-3 space-y-2">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Size</span>
              <span className="text-[11px] text-muted">{size}px</span>
            </div>
            <input
              type="range"
              min={256}
              max={2000}
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={256}
                max={2000}
                value={size}
                onChange={(e) =>
                  onSizeChange(
                    Math.min(2000, Math.max(256, Number(e.target.value) || 256))
                  )
                }
                className="w-20 input text-[11px]"
              />
              <span className="text-[11px] text-muted">px</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Margin</span>
              <span className="text-[10px] text-muted">{style?.margin ?? 10}px</span>
            </label>
            <input
              type="range"
              min={0}
              max={80}
              value={style?.margin ?? 10}
              onChange={(e) => onStyleChange?.("margin", Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={200}
                value={style?.margin ?? 10}
                onChange={(e) => onStyleChange?.("margin", Math.max(0, Number(e.target.value) || 0))}
                className="w-20 input text-[11px]"
              />
              <span className="text-[11px] text-muted">px</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QRCustomizer;
