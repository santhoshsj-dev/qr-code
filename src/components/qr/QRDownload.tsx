// src/components/qr/QRDownload.tsx
import React, { useState } from "react";
import type { QRSettings } from "../../pages/Home";
import { saveAs } from "file-saver";

interface QRDownloadProps {
  settings: QRSettings;
  disabled: boolean;
  onFormatChange: (format: "png" | "svg" | "jpeg") => void;
  qrInstanceRef?: React.MutableRefObject<unknown | null>;
}

type QRInstance = {
  update?: (opts: unknown) => Promise<void> | void;
  download?: (arg?: unknown) => void;
  _container?: HTMLElement | null;
  _el?: HTMLElement | null;
  _options?: Record<string, unknown>;
} | null;

// Download panel – file format selector + download button + hints.
const QRDownload: React.FC<QRDownloadProps> = ({
  settings,
  disabled,
  onFormatChange,
  qrInstanceRef,
}) => {
  const [fileNameInput, setFileNameInput] = useState("qr");

  const handleDownload = async () => {
    if (disabled) return;

    const inst = qrInstanceRef?.current as QRInstance;
    if (!inst) {
      alert("No QR available to download yet. Try generating one first.");
      return;
    }

    // Guard: transparent + jpeg is incompatible
    if ((settings.style?.backgroundColor ?? "") === "transparent" && settings.format === "jpeg") {
      alert("JPEG does not support transparency. Choose PNG or SVG for a transparent background.");
      return;
    }

    try {
      // Resize instance to requested export size (preserve preview size)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prevWidth = (inst._options as any)?.width ?? null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prevHeight = (inst._options as any)?.height ?? null;
      let prevBg: string | null = null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prevBg = (inst._options as any)?.background?.color ?? (inst._options as any)?.backgroundOptions?.color ?? null;
      } catch {
        prevBg = null;
      }

      if (typeof inst.update === 'function') {
        try {
          await inst.update({ width: settings.size, height: settings.size, backgroundOptions: { color: settings.style?.backgroundColor || "#0f172a" } });
          console.debug("resized instance for export", settings.size, settings.format);
        } catch (err) {
          console.debug("async update failed", err);
          try {
            inst.update({ width: settings.size, height: settings.size, backgroundOptions: { color: settings.style?.backgroundColor || "#0f172a" } });
          } catch (err2) {
            console.debug("sync update failed", err2);
          }
        }
      } else {
        console.debug('instance.update not available, skipping resize');
      }

      // Try to capture canvas/svg/img from the instance container
      const container = (inst._container || inst._el || null) as HTMLElement | null;
      let blob: Blob | null = null;

      // small delay to allow renderer to update DOM (some implementations render async)
      await new Promise((res) => setTimeout(res, 60));

      if (container) {
        const wantSvg = settings.format === "svg";

        // If SVG selected, prefer SVG element to avoid saving PNG data with .svg extension.
        if (wantSvg) {
          const svg = container.querySelector("svg") as SVGElement | null;
          if (svg) {
            const svgString = new XMLSerializer().serializeToString(svg);
            blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          }
        }

        // For PNG/JPEG (or if SVG not found), fall back to canvas.
        if (!blob && !wantSvg) {
          const canvas = container.querySelector("canvas") as HTMLCanvasElement | null;
          if (canvas) {
            blob = await new Promise<Blob | null>((resolve) => {
              try {
                canvas.toBlob((b) => {
                  if (b) return resolve(b);
                  try {
                    // fallback to dataURL conversion
                    const dataUrl = canvas.toDataURL(`image/${settings.format === "jpeg" ? "jpeg" : "png"}`);
                    const parts = dataUrl.split(",");
                    const mimeMatch = parts[0].match(/:(.*?);/);
                    const mime = mimeMatch?.[1] ?? "image/png";
                    const bstr = atob(parts[1]);
                    let n = bstr.length;
                    const u8 = new Uint8Array(n);
                    while (n--) u8[n] = bstr.charCodeAt(n);
                    resolve(new Blob([u8], { type: mime }));
                  } catch {
                    resolve(null);
                  }
                });
              } catch {
                resolve(null);
              }
            });
          }
        }

        // As a last resort, capture SVG even if PNG/JPEG was requested.
        if (!blob) {
          const svg = container.querySelector("svg") as SVGElement | null;
          if (svg) {
            const svgString = new XMLSerializer().serializeToString(svg);
            blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          }
        }

        if (!blob) {
          const img = container.querySelector("img") as HTMLImageElement | null;
          if (img && img.src) {
            try {
              const resp = await fetch(img.src);
              blob = await resp.blob();
            } catch (e) {
              console.debug('failed to fetch image src for download', e);
            }
          }
        }
      }

      if (blob) {
        console.debug("download: captured blob", blob.type, blob.size);
        try {
          saveAs(blob, `${fileNameInput || "qr"}.${settings.format === "jpeg" ? "jpg" : settings.format}`);
        } catch (e) {
          console.error("saveAs failed", e);
          alert("Download failed while saving file. Check console for details.");
        }
      } else if (typeof inst.download === "function") {
        // try object signature with filename first
        console.debug("download: falling back to instance.download with object signature");
        try {
          inst.download({ extension: settings.format, name: fileNameInput || "qr" });
          console.debug("download: instance.download(object) called");
        } catch (errA) {
          console.debug("download: object signature failed, trying string signature", errA);
          try {
            // older signature: string
            inst.download(settings.format);
            console.debug("download: instance.download(string) called");
          } catch (errB) {
            console.debug("download: string signature failed, trying extension object", errB);
            try {
              inst.download({ extension: settings.format });
              console.debug("download: instance.download({ extension }) called");
            } catch (errC) {
              console.error("download: all instance.download attempts failed", errC);
              alert("Download not available — please try right-click Save image or use a different browser.");
            }
          }
        }
      } else {
        console.error("download: no blob and no instance.download available");
        alert("Download not supported by the current QR renderer.");
      }

      // restore size/background for preview
      try {
        if (typeof inst.update === 'function' && (prevWidth || prevHeight)) {
          await inst.update({ width: prevWidth, height: prevHeight, backgroundOptions: { color: prevBg } });
        } else {
          console.debug('instance.update not available or no previous size to restore');
        }
      } catch (err) {
        console.debug('failed to restore preview size/background', err);
      }

      return;
    } catch (e) {
      console.error(e);
      alert("Failed to download QR — check console for details.");
    }
  };

  return (
    <div className="panel text-[11px]">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-foreground">Download</span>
        <span className="text-[10px] text-muted">
          {settings.size}px · {settings.format.toUpperCase()}
        </span>
      </div>

      {/* Filename */}
      <div className="mb-3">
        <label className="mb-1 block text-[10px] text-muted">Filename</label>
        <input
          type="text"
          value={fileNameInput}
          onChange={(e) => setFileNameInput(e.target.value)}
          className="w-full input text-[11px]"
          placeholder="qr"
        />
      </div>

      {/* File format selector */}
      <div className="mb-3 flex gap-2">
        {(["png", "svg", "jpeg"] as const).map((fmt) => {
          const active = settings.format === fmt;
          return (
            <button
              key={fmt}
              type="button"
              onClick={() => onFormatChange(fmt)}
              className={[
                "flex-1 rounded px-2 py-1 text-center",
                active
                  ? "bg-primary text-primary-foreground"
                  : "btn-secondary hover:opacity-90",
              ].join(" ")}
            >
              {fmt.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Primary download */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleDownload}
        className="mb-2 inline-flex w-full items-center justify-center rounded bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        Download QR
      </button>

      {/* Secondary hints */}
      <ul className="space-y-1 text-[10px] text-muted">
        <li>Tip: You can also right‑click the QR preview and “Save image as”.</li>
        <li>Drag‑to‑save works in most desktop browsers.</li>
      </ul>
    </div>
  );
};

export default QRDownload;
