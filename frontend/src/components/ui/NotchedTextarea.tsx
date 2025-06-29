import React from "react";

// Define the props, accepting all standard textarea props plus a label.
type NotchedTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    className?: string;
  };

export default function NotchedTextarea({
  label,
  id,
  className,
  ...props
}: NotchedTextareaProps) {
  return (
    // The <fieldset> creates the border, just like before.
    <fieldset className={`rounded border border-brown/50 px-3 ${className}`}>
      <legend className="px-1 text-sm text-dark-gray/80">{label}</legend>
      <textarea
        id={id}
        // The styling makes the textarea invisible inside the fieldset
        className={`
          w-full 
          bg-transparent 
          pb-2 
          pt-1 
          text-sm 
          text-dark-gray 
          placeholder:text-dark-gray/60 
          focus:outline-none
          resize-y 
        `}
        {...props} // Pass down props like value, onChange, rows, etc.
      />
    </fieldset>
  );
}
