"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/atoms/Text";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) {
  // Handle escape key to close and toggle body scroll lock
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg bg-[#001c16] rounded-[32px] shadow-2xl border border-emerald-500/10 overflow-hidden flex flex-col z-10 text-white"
          >
            {/* Decorative background gradients */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between relative z-10">
              <Text variant="h3" className="text-white font-extrabold">
                {title}
              </Text>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] relative z-10">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-6 pt-4 border-t border-white/5 bg-black/20 flex justify-end gap-3 relative z-10">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
