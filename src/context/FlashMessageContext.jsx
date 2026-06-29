"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/atoms/Text";

const FlashMessageContext = createContext(null);

export function FlashMessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const showFlashMessage = useCallback((type, text, duration = 4000) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, duration);
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return (
    <FlashMessageContext.Provider value={showFlashMessage}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {messages.map((msg) => {
            let bgColor, borderColor, textColor, icon, progressBg;
            if (msg.type === "success") {
              bgColor = "bg-[#001c16]/95";
              borderColor = "border-emerald-500/30";
              textColor = "text-emerald-400";
              progressBg = "bg-emerald-500";
              icon = (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              );
            } else if (msg.type === "warning") {
              bgColor = "bg-[#1f1600]/95";
              borderColor = "border-amber-500/30";
              textColor = "text-amber-400";
              progressBg = "bg-amber-500";
              icon = (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              );
            } else {
              // error
              bgColor = "bg-[#1f0005]/95";
              borderColor = "border-red-500/30";
              textColor = "text-red-400";
              progressBg = "bg-red-500";
              icon = (
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                layout
                className={`pointer-events-auto w-full p-4 rounded-2xl border ${borderColor} ${bgColor} shadow-xl backdrop-blur-xl flex items-start gap-3 relative overflow-hidden`}
              >
                <div className="shrink-0 mt-0.5">{icon}</div>
                <div className="flex-1 min-w-0 pr-4">
                  <Text variant="caption" className={`font-bold block uppercase tracking-wider text-[10px] ${textColor} mb-0.5`}>
                    {msg.type}
                  </Text>
                  <Text variant="body" className="text-slate-100 font-semibold text-xs leading-normal">
                    {msg.text}
                  </Text>
                </div>
                <button
                  onClick={() => removeMessage(msg.id)}
                  className="shrink-0 text-slate-500 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                >
                  ✕
                </button>
                {/* Visual animating duration progress bar */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-[3px] ${progressBg}`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </FlashMessageContext.Provider>
  );
}

export function useFlashMessage() {
  const context = useContext(FlashMessageContext);
  if (!context) {
    throw new Error("useFlashMessage must be used within a FlashMessageProvider");
  }
  return context;
}
