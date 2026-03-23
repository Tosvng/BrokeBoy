import React, { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="label-sm text-on-surface-variant"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3.5 rounded-2xl
          bg-surface-card text-on-surface
          placeholder:text-on-surface-variant/50
          border border-transparent
          focus:outline-none focus:border-gold/50 focus:bg-surface-card-high
          transition-all duration-200
          ${error ? "border-error/50 bg-error/5" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="body-sm text-error">{error}</p>}
    </div>
  );
};
