"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/atoms/Text";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const WEEK_DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function DatePicker({
  label,
  value,
  onChange,
  required = false,
  error,
  className = "",
  id,
  inputClassName = "",
  direction = "up",
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, width: 0, height: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("scroll", updateCoords);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      window.removeEventListener("scroll", updateCoords);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen]);

  // Initialize viewDate when value changes
  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setViewDate(parsed);
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      const clickedDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      const clickedPopover = popoverRef.current && popoverRef.current.contains(event.target);
      if (!clickedDropdown && !clickedPopover) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day) => {
    if (!day) return;
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    onChange({ target: { value: dateStr } });
    setIsOpen(false);
  };

  // Generate calendar grid
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysGrid = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    daysGrid.push(i);
  }

  const getDisplayValue = () => {
    if (!value) return "Pilih tanggal...";
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return value;
      return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return value;
    }
  };

  // Check if a date grid item is the currently selected date
  const isSelected = (day) => {
    if (!value || !day) return false;
    const d = new Date(value);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
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

      {/* Selector Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 pl-11 text-left text-sm rounded-xl border flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all relative ${isDarkTheme
            ? "bg-black/20 border-white/10 text-white placeholder:text-zinc-500"
            : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400"
          } ${error ? "border-red-500 focus:ring-red-500" : ""}`}
      >
        <span className={!value ? (isDarkTheme ? "text-zinc-500" : "text-zinc-400") : ""}>
          {getDisplayValue()}
        </span>

        {/* Calendar Icon overlay */}
        <div className="absolute left-4 top-3.5 pointer-events-none text-zinc-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </button>

      {/* Custom Calendar Popover Menu via React Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.95, y: direction === "up" ? 8 : -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: direction === "up" ? 8 : -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`absolute z-[9999] p-4 rounded-2xl border shadow-2xl flex flex-col gap-3 min-w-[280px] ${isDarkTheme
                  ? "bg-[#00241d] border-emerald-500/10 text-white shadow-emerald-950/20"
                  : "bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50"
                }`}
              style={{
                position: "absolute",
                top: direction === "up" ? coords.top : coords.bottom,
                left: coords.left,
                width: Math.max(coords.width, 280),
                transform: direction === "up" ? "translateY(calc(-100% - 6px))" : "translateY(6px)",
              }}
            >
              {/* Header controls */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  className={`p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer ${isDarkTheme ? "text-zinc-300 hover:text-white" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <Text variant="body" className="font-bold text-xs">
                  {MONTH_NAMES[month]} {year}
                </Text>
                <button
                  type="button"
                  onClick={nextMonth}
                  className={`p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer ${isDarkTheme ? "text-zinc-300 hover:text-white" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Week days labels */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEK_DAYS.map((day) => (
                  <span key={day} className={`text-[10px] font-extrabold uppercase ${isDarkTheme ? "text-zinc-500" : "text-zinc-400"}`}>
                    {day}
                  </span>
                ))}
              </div>

              {/* Days grid selection */}
              <div className="grid grid-cols-7 gap-1">
                {daysGrid.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} />;
                  }
                  const active = isSelected(day);
                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={`w-full aspect-square text-xs font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer ${active
                          ? "bg-[#ea580c] text-white shadow-md shadow-[#ea580c]/20"
                          : isDarkTheme
                            ? "hover:bg-emerald-500/10 text-zinc-200 hover:text-white"
                            : "hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900"
                        }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
}
