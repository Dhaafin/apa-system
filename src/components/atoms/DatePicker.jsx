import React from "react";

export default function DatePicker({
  label,
  value,
  onChange,
  required = false,
  error,
  className = "",
  id,
  inputClassName = "",
  ...props
}) {
  const inputId = id || `date-${label ? label.toLowerCase().replace(/\s+/g, "-") : "default"}`;

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
      <div className="relative">
        <input
          id={inputId}
          type="date"
          value={value}
          onChange={onChange}
          onClick={(e) => {
            try {
              e.target.showPicker();
            } catch (err) {}
          }}
          required={required}
          className={`w-full px-4 py-3 pl-11 text-sm rounded-xl border bg-white text-zinc-900 border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#004d3d] focus:border-transparent transition-all placeholder:text-zinc-400 dark:bg-zinc-950 dark:text-white dark:border-zinc-800 cursor-pointer ${
            error ? "border-red-500 focus:ring-red-500" : ""
          } ${inputClassName}`}
          style={{ colorScheme: inputClassName.includes("text-white") ? "dark" : "light" }}
          {...props}
        />
        {/* Calendar SVG Icon */}
        <div className="absolute left-4 top-3.5 pointer-events-none text-zinc-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
}
