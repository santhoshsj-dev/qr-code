// src/components/bulk/BulkGenerator.tsx
import React, { useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCodeStyling from "qr-code-styling";
import BulkUpload from "./BulkUpload";
import BulkWarning from "./BulkWarning";
import BulkProgress from "./BulkProgress";
import BulkResult from "./BulkResult";

// Basic local state to orchestrate bulk flow.
// Later you can move this into useBulkQR hook.
type BulkStatus = "idle" | "ready" | "running" | "completed" | "canceled";

const createBlobFromRendered = async (container: HTMLElement, format: string) => {
  // Look for canvas first (PNG/JPEG).
  const canvas = container.querySelector("canvas") as HTMLCanvasElement | null;
  if (canvas) {
    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), `image/${format === "jpeg" ? "jpeg" : "png"}`);
    });
  }

  // Fallback to svg
  const svg = container.querySelector("svg") as SVGElement | null;
  if (svg) {
    const svgString = new XMLSerializer().serializeToString(svg);
    return new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  }

  return null;
};

const BulkGenerator: React.FC = () => {
  const [status, setStatus] = useState<BulkStatus>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [parsedRows, setParsedRows] = useState<string[]>([]);

  const cancelRef = useRef(false);

  const handleFileParsed = (name: string, rows: number, data?: string[]) => {
    setFileName(name);
    setRowCount(rows);
    setParsedRows(data || []);
    setStatus("ready");
  };

  const handleStart = () => setShowWarning(true);

  const confirmStartAfterWarning = async () => {
    setShowWarning(false);
    setStatus("running");
    cancelRef.current = false;

    const total = parsedRows.length;
    setProgress({ current: 0, total });

    const zip = new JSZip();

    for (let i = 0; i < parsedRows.length; i++) {
      if (cancelRef.current) break;
      const line = (parsedRows[i] || "").toString();
      const content = line; // each CSV line is the QR content

      // Create a temporary container per QR
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      document.body.appendChild(container);

      // create instance and append
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inst = new (QRCodeStyling as any)({
        width: 512,
        height: 512,
        data: content,
        margin: 10,
        imageOptions: { crossOrigin: "anonymous", margin: 5 },
      });
      inst.append(container);

      // wait briefly for rendering (library may render sync or async)
      await new Promise((r) => setTimeout(r, 50));

      const blob = await createBlobFromRendered(container, "png");
      const safeName = (content && content.replace(/[^a-z0-9_-]/gi, "-").slice(0, 64)) || `qr-${i + 1}`;
      if (blob) zip.file(`${safeName}.png`, blob);

      // cleanup
      document.body.removeChild(container);

      setProgress({ current: i + 1, total });
    }

    if (!cancelRef.current) {
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${fileName ?? "qrs"}.zip`);
      setStatus("completed");
    } else {
      setStatus("canceled");
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setStatus("canceled");
  };

  const handleDownloadZip = () => {
    // No-op – download handled when generation completes.
    // This button remains for parity with the UI.
  };

  return (
    <div className="space-y-4 text-xs">
      <BulkUpload onFileParsed={handleFileParsed} />

      {/* Info and primary CTA */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] text-muted">
          {fileName ? (
            <>
              <span className="font-medium text-muted-foreground">{fileName}</span>{" "}
              · {rowCount} rows detected (soft limit ~1000 recommended).
            </>
          ) : (
            <>Upload a CSV with one row per QR.</>
          )}
        </div>
        <button
          disabled={status === "running" || !fileName}
          onClick={handleStart}
          className="inline-flex items-center rounded bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "running" ? "Generating…" : "Generate QRs"}
        </button>
      </div>

      {/* Warning modal before heavy generation */}
      {showWarning && (
        <BulkWarning
          rowCount={rowCount}
          onCancel={() => setShowWarning(false)}
          onConfirm={confirmStartAfterWarning}
        />
      )}

      {/* Progress & result */}
      {status === "running" && (
        <BulkProgress
          current={progress.current}
          total={progress.total}
          onCancel={handleCancel}
        />
      )}

      {(status === "completed" || status === "canceled") && (
        <BulkResult
          status={status}
          rowCount={rowCount}
          onDownloadZip={handleDownloadZip}
        />
      )}
    </div>
  );
};

export default BulkGenerator;
