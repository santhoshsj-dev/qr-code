// src/components/qr/QRGenerator.tsx
import React, { useState } from "react";
import type { QRType } from "../../pages/Home";
import PhoneInput from "../ui/PhoneInput";



interface QRGeneratorProps {
  type: QRType;
  data: Record<string, string>;
  onChangeField: (field: string, value: string) => void;
}

// Small input helper component so markup stays clean.
interface FieldProps {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  type?: string;
  helper?: string;
  required?: boolean;
  onChange: (name: string, value: string) => void;
}

const Field: React.FC<FieldProps> = ({
  label,
  name,
  value = "",
  placeholder,
  type = "text",
  helper,
  required,
  onChange,
}) => {
  return (
    <div className="space-y-1">
      <label className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        {required && <span className="text-[10px] text-destructive">Required</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full input px-2 py-1 text-[11px] placeholder:text-muted focus:outline-none"
      />
      {helper && (
        <p className="text-[10px] text-muted">{helper}</p>
      )}
    </div>
  );
};

// Main dynamic form that swaps structure based on QR type.
const QRGenerator: React.FC<QRGeneratorProps> = ({
  type,
  data,
  onChangeField,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (name: string, value: string) => {
    onChangeField(name, value);

    // basic validations
    if (name === "url") {
      try {
        if (value.trim() === "") {
          setErrors((e) => ({ ...e, url: "" }));
        } else {
          new URL(value);
          setErrors((e) => {
            const copy = { ...e };
            delete copy.url;
            return copy;
          });
        }
      } catch {
        setErrors((e) => ({ ...e, url: "Enter a valid URL (include https://)" }));
      }
    }

    if (name === "email") {
      if (value.trim() === "") {
        setErrors((e) => ({ ...e, email: "" }));
      } else {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setErrors((e) => {
          const copy = { ...e };
          if (!ok) copy.email = "Enter a valid email address";
          else delete copy.email;
          return copy;
        });
      }
    }

    if (name === "phone") {
      const num = (value || "").replace(/\D/g, "");
      setErrors((e) => ({
        ...e,
        phone: num && num.length < 6 ? "Enter a valid phone number" : "",
      }));
    }
  };

  if (type === "url") {
    return (
      <div className="space-y-2">
        <Field
          label="Website URL"
          name="url"
          value={data.url}
          placeholder="https://example.com"
          helper="Use a full URL including https://"
          required
          type="url"
          onChange={handleFieldChange}
        />
        {errors.url && <p className="text-[10px] text-destructive">{errors.url}</p>}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="space-y-2">
        <label className="text-[11px] text-muted-foreground">Text content</label>
        <textarea
          name="text"
          value={data.text || ""}
          placeholder="Any text, note, or message…"
          onChange={(e) => onChangeField("text", e.target.value)}
          rows={4}
          className="w-full resize-y input text-[11px] placeholder:text-muted-foreground focus:outline-none"
        />
        <p className="text-[10px] text-muted">
          The QR will encode exactly this text.
        </p>
      </div>
    );
  }

  if (type === "email") {
    return (
      <div className="space-y-2">
        <Field
          label="Email address"
          name="email"
          value={data.email}
          placeholder="user@example.com"
          required
          type="email"
          onChange={handleFieldChange}
        />
        {errors.email && <p className="text-[10px] text-destructive">{errors.email}</p>}
        <Field
          label="Subject"
          name="subject"
          value={data.subject}
          placeholder="Hello from QR"
          onChange={onChangeField}
        />
        <div className="space-y-1">
          <label className="text-[11px] text-muted-foreground">
            Message body
          </label>
          <textarea
            name="body"
            value={data.body || ""}
            placeholder="Pre-fill the email message…"
            onChange={(e) => onChangeField("body", e.target.value)}
            rows={3}
            className="w-full input px-2 py-1 text-[11px] placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>
    );
  }

  if (type === "phone") {
    return (
      <div className="space-y-2">
        <PhoneInput
          value={data.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          placeholder="Enter phone number"
        />
        {errors.phone && <p className="text-[10px] text-destructive">{errors.phone}</p>
  }</div>
    );
  }

  if (type === "vcard") {
    return (
      <div className="space-y-2">
        <Field
          label="Full name"
          name="fullName"
          value={data.fullName}
          required
          onChange={onChangeField}
        />
        <Field
          label="Company"
          name="company"
          value={data.company}
          onChange={onChangeField}
        />
        <Field
          label="Job title"
          name="jobTitle"
          value={data.jobTitle}
          onChange={onChangeField}
        />
        <Field
          label="Phone"
          name="phone"
          value={data.phone}
          type="tel"
          onChange={onChangeField}
        />
        <Field
          label="Email"
          name="email"
          value={data.email}
          type="email"
          onChange={onChangeField}
        />
        <Field
          label="Website"
          name="website"
          value={data.website}
          placeholder="https://portfolio.com"
          type="url"
          onChange={onChangeField}
        />
      </div>
    );
  }

  if (type === "whatsapp") {
    return (
      <div className="space-y-2">
        <PhoneInput
          value={data.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          placeholder="Enter WhatsApp number"
        />
        {errors.phone && <p className="text-[10px] text-destructive">{errors.phone}</p>}
        <div className="space-y-1">
          <label className="text-[11px] text-muted-foreground">Prefilled message</label>
          <textarea
            name="message"
            value={data.message || ""}
            placeholder="Hi, I found you from your QR code…"
            onChange={(e) => onChangeField("message", e.target.value)}
            rows={3}
            className="w-full input px-2 py-1 text-[11px] placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>
    );
  }

  // Social links – show platform selector plus username/url.
  if (type === "social") {
    const platform = data.platform || "instagram";

    const platforms: { id: string; label: string }[] = [
      { id: "instagram", label: "Instagram" },
      { id: "facebook", label: "Facebook" },
      { id: "linkedin", label: "LinkedIn" },
      { id: "youtube", label: "YouTube" },
    ];

    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] text-muted-foreground">
            Social platform
          </label>
          <div className="flex flex-wrap gap-1">
            {platforms.map((p) => {
              const active = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChangeField("platform", p.id)}
                  className={[
                    "rounded px-2.5 py-1 text-[11px]",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "panel hover:opacity-90",
                  ].join(" ")}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <Field
          label="Profile URL or handle"
          name="handle"
          value={data.handle}
          placeholder="@username or full URL"
          required
          onChange={onChangeField}
        />
      </div>
    );
  }

  return null;
};

export default QRGenerator;
