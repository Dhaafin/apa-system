import React, { useState, useRef, useEffect } from "react";

export default function CustomDropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Pilih opsi...",
  required = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`flex flex-col gap-1.5 w-full relative ${className}`}>
      {label && (
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-sm text-left rounded-xl border bg-white text-zinc-900 border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#004d3d] focus:border-transparent transition-all flex items-center justify-between dark:bg-zinc-950 dark:text-white dark:border-zinc-800 cursor-pointer"
      >
        <span className={value ? "text-zinc-900 dark:text-white" : "text-zinc-400"}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Options Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-xl dark:bg-zinc-950 dark:border-zinc-800 scrollbar-thin">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between cursor-pointer ${
                  value === option
                    ? "bg-zinc-50 font-semibold text-[#004d3d] dark:bg-zinc-900 dark:text-emerald-400"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {option}
                {value === option && (
                  <svg
                    className="w-4 h-4 text-[#004d3d] dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
