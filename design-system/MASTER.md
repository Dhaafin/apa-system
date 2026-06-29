# SIPA Adventure Master Design System

This document outlines the visual identity and design tokens for the SIPA Adventure web application, optimized for a high-end natural resort aesthetic.

## 🎨 Color Palette & Tokens

- **Primary Background**: `#001f18` (Deep Forest Green, rich and dark)
- **Secondary Accent**: `#ea580c` / `#c2410c` (Burnished Orange/Amber, giving a warm resort sunset contrast)
- **Card Background (Glassmorphism)**: `rgba(9, 9, 11, 0.6)` (`bg-zinc-950/60` with `backdrop-blur-xl`)
- **Borders**: `rgba(63, 63, 70, 0.8)` (`border-zinc-800/80` super thin)
- **Text Primary**: `#ffffff` (Pure white)
- **Text Muted**: `#a1a1aa` (`text-zinc-400`)

---

## ✍️ Typography

- **Heading & Body Font**: **Plus Jakarta Sans** (Sleek, geometric, high-contrast weight variation)
- **Heading Weight**: `font-black` (`900` weight) or `font-extrabold` (`800` weight)
- **Tracking**: `tracking-tight` for headings, `tracking-widest` for uppercase subheaders.

---

## ✨ Visual Styling & Effects

- **Glassmorphism Cards**:
  - CSS: `background: rgba(9, 9, 11, 0.6); backdrop-filter: blur(24px); border: 1px solid rgba(63, 63, 70, 0.8);`
  - Shadow: Soft floating shadows (`shadow-2xl` with a subtle orange/green ambient glow shadow overlay).
- **Interactive States**:
  - Active press scale: `active:scale-[0.98]`
  - Smooth transitions: `transition-all duration-300 ease-out`

---

## 🎬 Framer Motion Guidelines (Dynamic & Immersive)

- **Modal Open/Close Transitions**:
  - Backdrop: `opacity` transition from `0` to `1`.
  - Dialog Card: Spring physics animation (`type: "spring", stiffness: 300, damping: 25`) scaling from `0.95` to `1` and sliding up `20px`.
- **Card Hover states**:
  - `whileHover={{ y: -6, scale: 1.01, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}`
- **Page Transitions**:
  - Slide and fade page entrance: `initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}`.
