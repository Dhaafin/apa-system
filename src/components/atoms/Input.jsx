import React from "react";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = "",
  id,
  ...props
}) {
  const inputId = id || `input-${label ? label.toLowerCase().replace(/\s+/g, "-") : "default"}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-zinc-900 border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#004d3d] focus:border-transparent transition-all placeholder:text-zinc-400 dark:bg-zinc-950 dark:text-white dark:border-zinc-800 ${
          error ? "border-red-500 focus:ring-red-500" : ""
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
}
