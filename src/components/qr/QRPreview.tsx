// src/components/qr/QRPreview.tsx
import React, { useEffect, useRef } from "react";
import type { QRSettings } from "../../pages/Home";
import QRCodeStyling from "qr-code-styling";

interface QRPreviewProps {
  settings: QRSettings;
  isEmpty: boolean;
  qrInstanceRef?: React.MutableRefObject<unknown | null>;
}

function buildData(settings: QRSettings) {
  const { type, data } = settings;
  switch (type) {
    case "url":
      return data.url || "";
    case "text":
      return data.text || "";
    case "email": {
      const to = data.email || "";
      const params: string[] = [];
      if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
      if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
      const query = params.length ? `?${params.join("&")}` : "";
      return `mailto:${to}${query}`;
    }
    case "phone": {
      const phoneVal = (data.phone || "").trim();
      if (!phoneVal) return "";
      // If user typed full E.164 number (starts with +), use it directly
      if (phoneVal.startsWith("+")) return `tel:${phoneVal}`;
      // otherwise pass the raw value (digits/spaces allowed)
      return `tel:${phoneVal.replace(/\s+/g, "")}`;
    }
    case "whatsapp": {
      const phoneVal = (data.phone || "").trim();
      if (!phoneVal) return "";
      const msg = data.message ? `?text=${encodeURIComponent(data.message)}` : "";
      let full = "";
      if (phoneVal.startsWith("+")) {
        full = phoneVal.replace(/\D/g, "").replace(/^0+/, "");
      } else {
        // no country code stored — assume user entered local or international number
        full = phoneVal.replace(/\D/g, "").replace(/^0+/, "");
      }
      return full ? `https://wa.me/${full}${msg}` : "";
    }
    case "vcard": {
      let v = "BEGIN:VCARD\nVERSION:3.0\n";
      if (data.fullName) v += `FN:${data.fullName}\n`;
      if (data.company) v += `ORG:${data.company}\n`;
      if (data.jobTitle) v += `TITLE:${data.jobTitle}\n`;
      if (data.phone) v += `TEL:${data.phone}\n`;
      if (data.email) v += `EMAIL:${data.email}\n`;
      if (data.website) v += `URL:${data.website}\n`;
      v += "END:VCARD";
      return v;
    }
    case "social": {
      const platform = data.platform || "instagram";
      const handle = (data.handle || "").trim();
      if (!handle) return "";
      if (/^https?:\/\//.test(handle)) return handle;
      const username = handle.replace(/^@/, "");
      switch (platform) {
        case "instagram":
          return `https://instagram.com/${username}`;
        case "facebook":
          return `https://facebook.com/${username}`;
        case "linkedin":
          return `https://linkedin.com/in/${username}`;
        case "youtube":
          return username.startsWith("@") || handle.startsWith("@")
            ? `https://www.youtube.com/@${username}`
            : `https://www.youtube.com/${username}`;
        default:
          return username;
      }
    }
    default:
      return "";
  }
}

// Preview panel – mounts a qr-code-styling instance and updates it.
const QRPreview: React.FC<QRPreviewProps> = ({ settings, isEmpty, qrInstanceRef }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // small helper type to avoid noisy `any` across the file
  type QRInstance = {
    update?: (opts: unknown) => Promise<void> | void;
    append?: (el: HTMLElement) => void;
    download?: (arg?: unknown) => void;
    _options?: { width?: number; height?: number } | unknown;
  } | null;

  useEffect(() => {
    const content = buildData(settings);
    const size = Math.min(settings.size, 320);

    // If input cleared, always remove nodes and drop instance
    if (isEmpty) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      if (qrInstanceRef) qrInstanceRef.current = null;
      return;
    }

    const style = settings.style || {};
    const inst = qrInstanceRef?.current as QRInstance;

    // instantiate if needed
    const imgSizePerc = style?.imagePixelSize ? ((style.imagePixelSize / size) * 100) : (style?.imageSize ?? 20);
    const imgMargin = Math.max(0, Math.round(size * (1 - imgSizePerc / 100) * 0.08));
    const cornersType = style?.cornerType === 'rounded' ? 'rounded' : 'square';
    const eyeType = style?.eyeType === 'rounded' ? 'rounded' : 'square';

    const computedMargin = style?.margin ?? 10;

    if (!inst) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instance = new (QRCodeStyling as any)({
        width: size,
        height: size,
        data: content,
        margin: computedMargin,
        image: style?.image || undefined,
        imageOptions: { crossOrigin: "anonymous", margin: imgMargin },
        dotsOptions: { color: style?.dotsColor || "#000000", type: style?.dotsType || "rounded" },
        backgroundOptions: { color: style?.backgroundColor || "#ffffff" },
        cornersSquareOptions: { type: cornersType },
        cornersDotOptions: { type: eyeType },
      });

      if (containerRef.current) {
        instance.append(containerRef.current);
      }

      if (qrInstanceRef) qrInstanceRef.current = instance;
    } else {
      // update existing instance with content and style changes
      try {
        if (typeof inst?.update === "function") {
          // call update (some versions return a promise, some don't)
          const maybePromise = inst.update({
            data: content,
            width: size,
            height: size,
            margin: settings.style?.margin ?? 10,
          dotsOptions: { color: settings.style?.dotsColor || "#000000", type: settings.style?.dotsType || "rounded" },
          backgroundOptions: { color: settings.style?.backgroundColor || "#ffffff" },
            image: settings.style?.image || undefined,
            imageOptions: { crossOrigin: "anonymous", margin: imgMargin },
            cornersSquareOptions: { type: cornersType },
            cornersDotOptions: { type: eyeType },
          });
          // if it returned a promise, attach a safe catch so we don't leak unhandled rejections
          if (maybePromise && typeof (maybePromise as Promise<void>).then === "function") {
            (maybePromise as Promise<void>).catch(() => {});
          }
        } else {
          throw new Error("update not available");
        }
      } catch {
        // ignore update errors – prefer to re-create if something goes wrong
        if (containerRef.current) containerRef.current.innerHTML = "";
        if (qrInstanceRef) qrInstanceRef.current = null;
      }
    }

    // no-op cleanup here; we explicitly handle empty state on next run
  }, [settings, isEmpty, qrInstanceRef]);


  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xs font-semibold text-foreground">Live preview</h2>
          <p className="text-[10px] text-muted">
            Static QR · {settings.size}px · {settings.format.toUpperCase()}
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
