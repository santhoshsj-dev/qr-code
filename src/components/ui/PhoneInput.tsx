"use client";

import React, { useState, forwardRef, useEffect } from "react";
import parsePhoneNumber from "libphonenumber-js";
import { CircleFlag } from "react-circle-flags";
import { lookup } from "country-data-list";
import { cn } from "../../lib/utils";

export type CountryData = {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
};

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onCountryChange?: (data: CountryData | undefined) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultCountry?: string; // alpha2 like 'us'
  className?: string;
  inline?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      onCountryChange,
      onChange,
      value,
      placeholder,
      defaultCountry,
      inline = false,
      ...props
    },
    ref
  ) => {
    const [displayFlag, setDisplayFlag] = useState<string>("");
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
      if (defaultCountry) {
        try {
          const newCountryData = lookup.countries({ alpha2: defaultCountry.toLowerCase() })[0];
          // defer flag set to avoid synchronous setState inside effect
          setTimeout(() => setDisplayFlag(defaultCountry.toLowerCase()), 0);

          if (
            !hasInitialized &&
            newCountryData?.countryCallingCodes?.[0] &&
            !value
          ) {
            const syntheticEvent = {
              target: {
                value: newCountryData.countryCallingCodes[0],
              },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange?.(syntheticEvent);
            // avoid sync setState within effect
            setTimeout(() => setHasInitialized(true), 0);
          }
        } catch {
          // ignore lookup failures
        }
      }
    }, [defaultCountry, onChange, value, hasInitialized]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      // Ensure the value starts with "+"
      if (!newValue.startsWith("+")) {
        if (newValue.startsWith("00")) {
          newValue = "+" + newValue.slice(2);
        } else {
          newValue = "+" + newValue;
        }
      }

      try {
        const parsed = parsePhoneNumber(newValue);

        if (parsed && parsed.country) {
          const countryCode = parsed.country;

          // Force immediate flag update
          setDisplayFlag("");
          setTimeout(() => {
            setDisplayFlag(countryCode.toLowerCase());
          }, 0);

          const countryInfo = lookup.countries({ alpha2: countryCode })[0];
          onCountryChange?.(countryInfo);

          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: parsed.number,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange?.(syntheticEvent);
        } else {
          onChange?.(e);
          setDisplayFlag("");
          onCountryChange?.(undefined);
        }
      } catch (error) {
        console.error("Error parsing phone number:", error);
        onChange?.(e);
        setDisplayFlag("");

        onCountryChange?.(undefined);
      }
    };

    const inputClasses = cn(
      "flex items-center gap-2 relative bg-transparent transition-colors text-base rounded-md border border-input pl-3 h-9 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed md:text-sm has-[input:focus]:outline-none has-[input:focus]:ring-1 has-[input:focus]:ring-ring [interpolate-size:allow-keywords]",
      inline && "rounded-l-none w-full",
      className
    );

    return (
      <div className={inputClasses}>
        {!inline && (
          <div className="w-4 h-4 rounded-full shrink-0">
            {displayFlag ? (
              <CircleFlag countryCode={displayFlag} height={16} />
            ) : (
              <span className="text-[12px]">🌐</span>
            )}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder || "Enter number"}
          type="tel"
          autoComplete="tel"
          name="phone"
          className={cn(
            "flex w-full border-none bg-transparent text-base transition-colors placeholder:text-muted-foreground outline-none h-9 py-1 p-0 leading-none md:text-sm [interpolate-size:allow-keywords]",
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
