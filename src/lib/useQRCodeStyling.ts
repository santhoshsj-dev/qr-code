// src/lib/useQRCodeStyling.ts
import { useEffect, useRef, useCallback } from "react";
import type { QRSettings } from "../pages/Home"; // adjust import path if needed

// Type for the QRCodeStyling class (imported dynamically)
type QRCodeStylingClass = new (options: any) => {
  update?: (opts: any) => Promise<void> | void;
  append?: (el: HTMLElement) => void;
  destroy?: () => void;
};

/**
 * Hook that lazily loads the `qr-code-styling` library on the client,
 * creates a single instance, updates it when settings change, and cleans up
 * on unmount.
 */
export function useQRCodeStyling(
  settings: QRSettings,
  containerRef: React.RefObject<HTMLDivElement | null>,
  isEmpty: boolean,
  debounceMs = 100,
  externalInstanceRef?: React.MutableRefObject<unknown | null>
) {
  const instanceRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);
  const classRef = useRef<QRCodeStylingClass | null>(null);
  const settingsRef = useRef<QRSettings>(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const destroyInstance = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (instanceRef.current) {
      try {
        // @ts-ignore - destroy may not exist in older versions
        instanceRef.current.destroy?.();
      } catch {}
      instanceRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
    if (externalInstanceRef) {
      externalInstanceRef.current = null;
    }
  }, [containerRef, externalInstanceRef]);

  const ensureClass = useCallback(async () => {
    if (classRef.current) return classRef.current;
    const mod = await import("qr-code-styling");
    classRef.current = (mod as any).default ?? (mod as any);
    return classRef.current;
  }, []);

  const createInstance = useCallback(
    (QRCodeStyling: QRCodeStylingClass) => {
      const s = settingsRef.current;
      const size = Math.min(s.size, 320);
      const style = s.style || {};
      const imgSizePerc = style?.imagePixelSize ? (style.imagePixelSize / size) * 100 : style?.imageSize ?? 20;
      const imgMargin = Math.max(0, Math.round(size * (1 - imgSizePerc / 100) * 0.08));
      const cornersType = style?.cornerType === "rounded" ? "rounded" : "square";
      const eyeType = style?.eyeType === "rounded" ? "rounded" : "square";
      const computedMargin = style?.margin ?? 10;

      const instance = new (QRCodeStyling as QRCodeStylingClass)({
        width: size,
        height: size,
        data: "", // placeholder, will be updated immediately
        margin: computedMargin,
        image: style?.image,
        imageOptions: { crossOrigin: "anonymous", margin: imgMargin },
        dotsOptions: { color: style?.dotsColor || "#000000", type: style?.dotsType || "rounded" },
        backgroundOptions: { color: style?.backgroundColor || "#ffffff" },
        cornersSquareOptions: { type: cornersType },
        cornersDotOptions: { type: eyeType },
      });
      if (containerRef.current) instance.append(containerRef.current);
      return instance;
    },
    [containerRef]
  );

  const ensureInstance = useCallback(async () => {
    if (instanceRef.current || isEmpty || !containerRef.current) return instanceRef.current;
    const QRCodeStyling = await ensureClass();
    if (!QRCodeStyling || !containerRef.current) return instanceRef.current;
    instanceRef.current = createInstance(QRCodeStyling);
    if (externalInstanceRef) {
      externalInstanceRef.current = instanceRef.current;
    }
    return instanceRef.current;
  }, [containerRef, createInstance, ensureClass, externalInstanceRef, isEmpty]);

  const buildData = (s: QRSettings) => {
    const { type, data } = s;
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
        if (phoneVal.startsWith("+")) return `tel:${phoneVal}`;
        return `tel:${phoneVal.replace(/\\s+/g, "")}`;
      }
      case "whatsapp": {
        const phoneVal = (data.phone || "").trim();
        if (!phoneVal) return "";
        const msg = data.message ? `?text=${encodeURIComponent(data.message)}` : "";
        let full = "";
        if (phoneVal.startsWith("+")) {
          full = phoneVal.replace(/\\D/g, "").replace(/^0+/, "");
        } else {
          full = phoneVal.replace(/\\D/g, "").replace(/^0+/, "");
        }
        return full ? `https://wa.me/${full}${msg}` : "";
      }
      case "vcard": {
        let v = "BEGIN:VCARD\\nVERSION:3.0\\n";
        if (data.fullName) v += `FN:${data.fullName}\\n`;
        if (data.company) v += `ORG:${data.company}\\n`;
        if (data.jobTitle) v += `TITLE:${data.jobTitle}\\n`;
        if (data.phone) v += `TEL:${data.phone}\\n`;
        if (data.email) v += `EMAIL:${data.email}\\n`;
        if (data.website) v += `URL:${data.website}\\n`;
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
  };

  // Create/destroy on mount/unmount
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard
    if (!isEmpty) {
      ensureInstance().catch(() => {});
    }
    return () => {
      destroyInstance();
    };
  }, [destroyInstance, ensureInstance, isEmpty]);

  // Update on settings change (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard
    if (isEmpty) {
      destroyInstance();
      return;
    }

    const run = async () => {
      await ensureInstance();
      const s = settingsRef.current;
      const size = Math.min(s.size, 320);
      const style = s.style || {};
      const imgSizePerc = style?.imagePixelSize ? (style.imagePixelSize / size) * 100 : style?.imageSize ?? 20;
      const imgMargin = Math.max(0, Math.round(size * (1 - imgSizePerc / 100) * 0.08));
      const cornersType = style?.cornerType === "rounded" ? "rounded" : "square";
      const eyeType = style?.eyeType === "rounded" ? "rounded" : "square";
      const computedMargin = style?.margin ?? 10;

      const update = () => {
        const content = buildData(s);
        try {
          instanceRef.current?.update?.({
            data: content,
            width: size,
            height: size,
            margin: computedMargin,
            dotsOptions: { color: style?.dotsColor || "#000000", type: style?.dotsType || "rounded" },
            backgroundOptions: { color: style?.backgroundColor || "#ffffff" },
            image: style?.image,
            imageOptions: { crossOrigin: "anonymous", margin: imgMargin },
            cornersSquareOptions: { type: cornersType },
            cornersDotOptions: { type: eyeType },
          });
        } catch {
          destroyInstance();
          ensureInstance().catch(() => {});
          instanceRef.current?.update?.({ data: content });
        }
      };

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(update, debounceMs);
    };

    run().catch(() => {});

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [settings, isEmpty, debounceMs, destroyInstance, ensureInstance]);
}
