"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/atoms/Text";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export default function TimePicker({
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
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const dropdownRef = useRef(null);

  // Sync state with selected value prop
  useEffect(() => {
    if (value) {
      const parts = value.split(":");
      if (parts.length >= 2) {
        setHour(parts[0]);
        setMinute(parts[1]);
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTime = () => {
    const timeStr = `${hour}:${minute}`;
    onChange({ target: { value: timeStr } });
    setIsOpen(false);
  };

  const isDarkTheme = inputClassName.includes("bg-black/20") || inputClassName.includes("bg-zinc-950");

  return (
    <div ref={dropdownRef} className={`flex flex-col gap-1.5 w-full relative ${className}`}>
      {label && (
        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? "text-zinc-300" : "text-zinc-700"}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Time Picker Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 pl-11 text-left text-sm rounded-xl border flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all relative ${
          isDarkTheme
            ? "bg-black/20 border-white/10 text-white placeholder:text-zinc-500"
            : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400"
        } ${error ? "border-red-500 focus:ring-red-500" : ""}`}
      >
        <span className={!value ? (isDarkTheme ? "text-zinc-500" : "text-zinc-400") : ""}>
          {value || "Pilih waktu..."}
        </span>
        
        {/* Clock SVG Icon overlay */}
        <div className="absolute left-4 top-3.5 pointer-events-none text-zinc-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </button>

      {/* Time Selection Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute left-0 right-0 z-50 mt-1 p-4 rounded-2xl border shadow-2xl flex flex-col gap-3 min-w-[200px] top-[calc(100%+4px)] ${
              isDarkTheme
                ? "bg-[#00241d] border-emerald-500/10 text-white shadow-emerald-950/20"
                : "bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50"
            }`}
          >
            {/* Scrollable selectors wrapper */}
            <div className="grid grid-cols-2 gap-3 h-40">
              {/* Hours Column */}
              <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                <Text variant="caption" className="text-center font-bold pb-1 block border-b border-white/5 uppercase tracking-wider text-[9px] text-zinc-400">Jam</Text>
                {HOURS.map((h) => (
                  <button
                    key={`h-${h}`}
                    type="button"
                    onClick={() => setHour(h)}
                    className={`w-full py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
                      hour === h
                        ? "bg-[#ea580c] text-white"
                        : isDarkTheme
                        ? "hover:bg-emerald-500/15 text-zinc-300"
                        : "hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>

              {/* Minutes Column */}
              <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                <Text variant="caption" className="text-center font-bold pb-1 block border-b border-white/5 uppercase tracking-wider text-[9px] text-zinc-400">Menit</Text>
                {MINUTES.map((m) => (
                  <button
                    key={`m-${m}`}
                    type="button"
                    onClick={() => setMinute(m)}
                    className={`w-full py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
                      minute === m
                        ? "bg-[#ea580c] text-white"
                        : isDarkTheme
                        ? "hover:bg-emerald-500/15 text-zinc-300"
                        : "hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Select confirmation button */}
            <button
              type="button"
              onClick={handleSelectTime}
              className="w-full py-2 bg-[#ea580c] hover:bg-[#ea580c]/90 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all text-center"
            >
              Pilih Waktu ({hour}:{minute})
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
}
