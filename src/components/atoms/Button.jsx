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
    "px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#004d3d] text-white hover:bg-[#00382c] focus:ring-[#004d3d] shadow-sm",
    secondary:
      "bg-[#ea580c] text-white hover:bg-[#c2410c] focus:ring-[#ea580c] shadow-sm",
    outline:
      "border border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 hover:text-zinc-900 focus:ring-zinc-500",
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
