"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    setAdminEmail("muhammadfc44@gmail.com");
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
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Manajemen Anggota", path: "/dashboard/anggota", icon: "👥" },
    { name: "Jadwal & Acara", path: "/dashboard/acara", icon: "📅" },
    { name: "Log Ekspedisi", path: "/dashboard/ekspedisi", icon: "🧭" },
    { name: "Galeri Foto", path: "/dashboard/galeri", icon: "🖼️" },
    { name: "Pengaturan", path: "/dashboard/pengaturan", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex text-zinc-900 font-sans">
      {/* SHARED LEFT SIDEBAR */}
      <aside className="w-80 bg-[#002d23] text-white flex flex-col justify-between p-6 shrink-0 border-r border-[#001f18]">
        <div className="flex flex-col gap-6">
          {/* Logo & Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#eab308] rounded-xl flex items-center justify-center font-bold text-xl text-[#002d23] shadow-md shadow-[#eab308]/10">
              ⛰️
            </div>
            <div>
              <h2 className="font-extrabold text-lg tracking-wider text-white uppercase leading-tight">
                Sipa Adventure
              </h2>
              <p className="text-[10px] font-bold text-[#eab308] tracking-widest uppercase">
                SMK Kimia PGRI Serang
              </p>
            </div>
          </div>

          {/* Quotation */}
          <div className="border border-white/10 rounded-xl px-4 py-3 bg-white/5 text-center">
            <p className="text-xs italic text-zinc-300">
              &ldquo;Anak Pencinta Alam (KAPALA)&rdquo;
            </p>
          </div>

          {/* Cloud Connection */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-black/25 text-xs">
            <span className="text-zinc-400 font-medium">Koneksi Cloud:</span>
            <div className="flex items-center gap-1.5 font-bold text-[#eab308]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Aktif
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all text-left ${
                    isActive
                      ? "text-white bg-[#ea580c] hover:bg-[#c2410c] shadow-lg shadow-[#ea580c]/15"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.icon}</span> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="flex flex-col gap-3 mt-auto">
          <p className="text-[11px] text-[#eab308]/60 text-center font-medium">
            Lestari Alamku, Jaya Sekolahku!
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-full border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>🚪</span> Keluar / Logout
          </button>
          <button className="w-full py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all">
            <span>🔄</span> Reset ke Default
          </button>
        </div>
      </aside>

      {/* DYNAMIC CONTENT AREA */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
