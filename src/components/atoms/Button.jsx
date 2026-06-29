import React from "react";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  ...props
}) {
  const baseStyles =
    "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[#004d3d] text-white hover:bg-[#003c2f] focus:ring-[#004d3d] shadow-[0_4px_14px_0_rgba(0,77,61,0.2)] hover:shadow-[0_6px_20px_rgba(0,77,61,0.25)] border border-transparent",
    secondary:
      "bg-[#ea580c] text-white hover:bg-[#d04e0a] focus:ring-[#ea580c] shadow-[0_4px_14px_0_rgba(234,88,12,0.2)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.25)] border border-transparent",
    outline:
      "border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-300 focus:ring-zinc-500 shadow-sm",
    ghost:
      "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 focus:ring-zinc-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
