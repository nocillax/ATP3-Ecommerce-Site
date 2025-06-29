// FILE: src/components/ui/NotchedInput.tsx

import React from "react";

// 1. Add an optional className prop to the interface
type NotchedInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
};

export default function NotchedInput({
  label,
  id,
  className, // 2. Receive the className prop
  ...props
}: NotchedInputProps) {
  return (
    <fieldset
      // 3. Apply the custom className alongside the default classes
      className={`rounded border border-brown/50 px-3 ${className}`}
    >
      <legend className="px-1 text-sm text-dark-gray/80">{label}</legend>
      <input
        id={id}
        className={`
          w-full 
          bg-transparent 
          pb-2 
          pt-1 
          text-sm 
          text-dark-gray 
          placeholder:text-dark-gray/60 
          focus:outline-none
        `}
        {...props}
      />
    </fieldset>
  );
}
