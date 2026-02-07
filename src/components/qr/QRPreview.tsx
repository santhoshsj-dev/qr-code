// src/components/qr/QRPreview.tsx
import React, { useRef } from "react";
import type { QRSettings } from "../../pages/Home";
import { useQRCodeStyling } from "../../lib/useQRCodeStyling";

interface QRPreviewProps {
  settings: QRSettings;
  isEmpty: boolean;
  qrInstanceRef?: React.MutableRefObject<unknown | null>;
}

// Preview panel - mounts a qr-code-styling instance and updates it.
const QRPreview: React.FC<QRPreviewProps> = ({ settings, isEmpty, qrInstanceRef }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useQRCodeStyling(settings, containerRef, isEmpty, 100, qrInstanceRef);

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xs font-semibold text-foreground">Live preview</h2>
          <p className="text-[10px] text-muted">
            Static QR - {settings.size}px - {settings.format.toUpperCase()}
          </p>
        </div>
        {/* Subtle "static" label */}
        <span className="rounded-full badge-success px-2 py-0.5 text-[10px]">
          static
        </span>
      </div>

      {/* Checkerboard background & QR container */}
      <div className="relative mt-2 flex items-center justify-center rounded-md bg-[linear-gradient(45deg,var(--color-popover)_25%,transparent_25%),linear-gradient(-45deg,var(--color-popover)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--color-popover)_75%),linear-gradient(-45deg,transparent_75%,var(--color-popover)_75%)] bg-size-[12px_12px] bg-position-[0_0,0_6px,6px_-6px,-6px_0] p-4">
        <div
          className="flex items-center justify-center rounded card shadow-lg"
          style={{
            width: Math.min(settings.size, 320),
            height: Math.min(settings.size, 320),
          }}
        >
          {isEmpty ? (
            <span className="text-[10px] text-muted px-4 text-center">
              Enter content on the left to see your QR code here.
            </span>
          ) : (
            <div
              ref={containerRef}
              style={{ width: Math.min(settings.size, 320), height: Math.min(settings.size, 320) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QRPreview;
