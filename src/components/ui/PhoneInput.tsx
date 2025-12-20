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
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState(true);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, "");
      const valid = digits.length >= 6;
      setIsValid(valid);
      onChange?.(e);
    };

    const handleBlur = () => {
      setIsTouched(true);
    };

    const inputClasses = cn(
      "flex items-center gap-2 relative bg-transparent transition-colors text-base rounded-md border pl-3 h-9 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed md:text-sm has-[input:focus]:outline-none has-[input:focus]:ring-1 has-[input:focus]:ring-ring [interpolate-size:allow-keywords]",
      isTouched && !isValid && "border-destructive",
      !isTouched && "border-input",
      className
    );

    return (
      <div className={inputClasses}>
        <input
          ref={ref}
          value={value}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          placeholder={placeholder || "+1234567890"}
          type="tel"
          autoComplete="tel"
          name="phone"
          aria-invalid={!isValid}
          className={cn(
            "flex w-full border-none bg-transparent text-base transition-colors placeholder:text-muted-foreground outline-none h-9 py-1 p-0 leading-none md:text-sm [interpolate-size:allow-keywords]",
            className
          )}
          {...props}
        />
        {!isValid && isTouched && (
          <p className="absolute -bottom-5 left-0 text-[10px] text-destructive">Invalid phone number</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
