"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Text from "@/components/atoms/Text";

/* ─── Modern inline SVG Icons ─── */
const Icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
    </svg>
  ),
  anggota: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  acara: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  ekspedisi: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  galeri: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  pengaturan: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  logout: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  reset: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
    </svg>
  )
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setAdminEmail(data.user.email || "");
            setAdminName(data.user.name || "");
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Icons.dashboard },
    { name: "Manajemen Anggota", path: "/dashboard/anggota", icon: Icons.anggota },
    { name: "Jadwal & Acara", path: "/dashboard/acara", icon: Icons.acara },
    { name: "Log Ekspedisi", path: "/dashboard/ekspedisi", icon: Icons.ekspedisi },
    { name: "Galeri Foto", path: "/dashboard/galeri", icon: Icons.galeri },
    { name: "Pengaturan", path: "/dashboard/pengaturan", icon: Icons.pengaturan },
  ];

  return (
    <div className="h-screen bg-[#001410] flex text-zinc-100 font-sans antialiased overflow-hidden">
      {/* ══ SLEEK SIDEBAR ══ */}
      <aside className="w-80 bg-[#001c16]/95 backdrop-blur-xl text-white flex flex-col justify-between p-6 shrink-0 border-r border-white/5 relative z-20">
        
        <div className="flex flex-col gap-6">
          {/* Header Brand */}
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-10 h-10 bg-[#ea580c] rounded-2xl flex items-center justify-center font-bold text-[#001c16] shadow-lg shadow-[#ea580c]/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.564-.386-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <Text variant="h3" className="font-extrabold text-white tracking-wide leading-tight">
                Pencinta Alam
              </Text>
              <Text variant="badge" color="accent" className="font-bold tracking-widest text-[#ea580c]">
                SMK Kimia PGRI Serang
              </Text>
            </div>
          </div>
 
          {/* Quotation / Tagline Card */}
          <div className="border border-white/5 rounded-2xl px-4 py-3 bg-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <Text variant="caption" className="italic text-slate-300 font-medium">
              &ldquo;Keluarga Besar KAPALA&rdquo;
            </Text>
          </div>
 
          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 mt-3">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group relative flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-sm font-semibold transition-colors text-left ${
                    isActive ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {/* Sliding active background indicator pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-sidebar-pill"
                      className="absolute inset-0 bg-[#ea580c] rounded-2xl -z-10 shadow-lg shadow-[#ea580c]/15"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}

                  {/* Icon wrapping with optional scale effect on hover */}
                  <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                    {item.icon}
                  </span>

                  <span className="relative z-10 transition-colors duration-200">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions & logged in profile */}
        <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-white/5">
          {/* User profile capsule */}
          {adminEmail && (
            <div className="px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ea580c]/10 border border-[#ea580c]/25 flex items-center justify-center font-bold text-[#ea580c] uppercase text-xs shrink-0">
                {adminEmail.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <Text variant="caption" className="font-bold text-white block truncate">
                  {adminName || "Admin Guru"}
                </Text>
                <span className="text-[10px] text-slate-500 truncate block">
                  {adminEmail}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-2xl border border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {Icons.logout}
              <span>Keluar / Logout</span>
            </button>
            <button className="w-full py-2.5 rounded-2xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
              {Icons.reset}
              <span>Reset ke Default</span>
            </button>
          </div>

          <Text variant="badge" className="text-center text-slate-600 tracking-wider">
            Lestari Alamku · Jaya Sekolahku
          </Text>
        </div>
      </aside>

      {/* ══ MAIN AREA: Dashboard content ══ */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto bg-[#f4f7f6] relative text-zinc-900">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {children}
      </main>
    </div>
  );
}
