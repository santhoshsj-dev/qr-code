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
      <div>
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
                "mt-1 bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 rounded-md border px-2 py-0.5 text-sm transition-colors file:h-6 file:text-xs/relaxed file:font-medium focus-visible:ring-[2px] aria-invalid:ring-[2px] md:text-xs/relaxed file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              {...props}
            />

      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
