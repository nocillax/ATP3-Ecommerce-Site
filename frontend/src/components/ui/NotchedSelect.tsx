import React from "react";
import { ChevronDown } from "lucide-react"; // For the dropdown arrow

// The shape of each option in the dropdown
interface SelectOption {
  value: string | number;
  label: string;
}

// Props for our new component, accepting standard <select> props
type NotchedSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  className?: string;
  options: SelectOption[];
};

export default function NotchedSelect({
  label,
  id,
  className,
  options,
  ...props
}: NotchedSelectProps) {
  return (
    // We use a relative container to position the arrow icon
    <div className={`relative ${className}`}>
      <fieldset
        // The fieldset provides the notched border, same as before
        className="h-full rounded border border-brown/50"
      >
        <legend className="ml-2 px-1 text-sm text-dark-gray/80">{label}</legend>

        <select
          id={id}
          className={`
            h-full
            w-full 
            bg-transparent
            px-3 
            pb-2 
            pt-1 
            text-sm 
            text-dark-gray 
            focus:outline-none
            appearance-none
          `}
          {...props} // Pass down props like value, onChange, etc.
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </fieldset>

      {/* This is the custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-gray">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}
