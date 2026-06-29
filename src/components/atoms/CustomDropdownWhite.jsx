"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/atoms/Text";

export default function CustomDropdownWhite({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Pilih...",
  direction = "down",
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

  const positionClass =
    direction === "up"
      ? "bottom-[calc(100%+4px)] origin-bottom"
      : "top-[calc(100%+4px)] origin-top";

  const displayValue = value === "ALL" ? placeholder : value;

  const displayOption = (option) => {
    if (option === "ALL") return placeholder;
    if (option === "PENDING") return "Pending";
    if (option === "APPROVED") return "Aktif";
    if (option === "REJECTED") return "Ditolak";
    return option;
  };

  return (
    <div ref={dropdownRef} className={`flex items-center gap-2 relative ${className}`}>
      {label && (
        <Text variant="caption" color="muted" className="font-bold shrink-0">
          {label}
        </Text>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-transparent min-w-[135px] justify-between shadow-sm"
      >
        <span className="truncate">{displayValue}</span>
        <svg
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: direction === "up" ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: direction === "up" ? 5 : -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute left-0 right-0 z-40 max-h-60 overflow-y-auto rounded-2xl bg-white shadow-xl flex flex-col p-1.5 gap-0.5 min-w-[145px] ${positionClass}`}
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-3 py-2 text-xs font-semibold text-left rounded-xl hover:bg-zinc-50 transition-colors flex items-center justify-between cursor-pointer ${value === option
                  ? "bg-orange-50/50 text-[#ea580c]"
                  : "text-zinc-600 hover:text-zinc-950"
                  }`}
              >
                <span className="truncate">{displayOption(option)}</span>
                {value === option && (
                  <svg className="w-3.5 h-3.5 text-[#ea580c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
