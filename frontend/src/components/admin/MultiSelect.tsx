// IN: src/components/admin/MultiSelect.tsx
// ACTION: Replace the entire file with this code.

"use client";

import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string; // ✅ Added label prop for the notch
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string; // ✅ Added className for custom styling
}

export default function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const availableOptions = options.filter(
    (option) => !selectedValues.includes(option.value)
  );

  const handleSelect = (value: string) => {
    onChange([...selectedValues, value]);
  };

  const handleDeselect = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* ✅ This is the new fieldset structure for the notched border */}
      <fieldset className="rounded border border-brown/50 px-2">
        <legend className="px-1 text-sm text-dark-gray/80">{label}</legend>
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="flex min-h-[38px] cursor-pointer flex-wrap items-center gap-2 py-1"
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-1 rounded bg-gray-200 px-2 py-0.5 text-sm"
              >
                {option.label}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeselect(option.value);
                  }}
                  className="hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          ) : (
            <span className="text-dark-gray/60">{placeholder}</span>
          )}
        </div>
      </fieldset>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
          <ul className="max-h-60 overflow-y-auto">
            {availableOptions.length > 0 ? (
              availableOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No options left</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
