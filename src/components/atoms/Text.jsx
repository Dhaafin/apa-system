import React from "react";

/**
 * Text — Reusable typography atom using Poppins (explicit className).
 *
 * @param {"h1"|"h2"|"h3"|"h4"|"body"|"caption"|"label"|"badge"} variant
 * @param {"primary"|"muted"|"accent"|"danger"|"success"|"inherit"} color
 * @param {"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"p"|"span"|"div"|"label"} as  — override rendered element
 * @param {string} className — additional Tailwind classes
 */
const VARIANT_STYLES = {
  h1:      "font-black   text-3xl  leading-tight  tracking-tight",
  h2:      "font-extrabold text-2xl leading-snug  tracking-tight",
  h3:      "font-bold    text-xl   leading-snug  tracking-tight",
  h4:      "font-semibold text-lg  leading-snug",
  body:    "font-normal  text-sm   leading-relaxed",
  caption: "font-medium  text-xs   leading-normal",
  label:   "font-semibold text-xs  leading-normal  uppercase tracking-widest",
  badge:   "font-bold    text-[10px] leading-none  uppercase tracking-[0.2em]",
};

const COLOR_STYLES = {
  primary: "text-white",
  muted:   "text-slate-400",
  accent:  "text-[#ea580c]",
  danger:  "text-red-400",
  success: "text-emerald-400",
  inherit: "",
};

const DEFAULT_TAG = {
  h1:      "h1",
  h2:      "h2",
  h3:      "h3",
  h4:      "h4",
  body:    "p",
  caption: "p",
  label:   "span",
  badge:   "span",
};

export default function Text({
  children,
  variant = "body",
  color = "primary",
  as,
  className = "",
  ...props
}) {
  const Tag = as || DEFAULT_TAG[variant] || "p";
  const variantClass = VARIANT_STYLES[variant] ?? VARIANT_STYLES.body;
  const colorClass   = COLOR_STYLES[color]   ?? COLOR_STYLES.primary;

  return (
    <Tag
      className={`font-[Poppins,sans-serif] ${variantClass} ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
