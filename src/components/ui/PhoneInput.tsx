"use client";

import React, { useState, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      onChange,
      value,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isValid, setIsValid] = useState(true);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, "");
      const valid = digits.length >= 6;
      setIsValid(valid);
      onChange?.(e);
    };

    return (
      <input
        ref={ref}
        value={value}
        onChange={handlePhoneChange}
        placeholder={placeholder || "+1234567890"}
        type="tel"
        autoComplete="tel"
        name="phone"
        aria-invalid={!isValid}
        className={cn(
          "w-full input px-2 py-1 text-[11px] placeholder:text-muted focus:outline-none",
          !isValid && "border-destructive",
          className
        )}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
