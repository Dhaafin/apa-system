"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import { motion } from "framer-motion";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Fetch student stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/students");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchActivities() {
      try {
        const response = await fetch("/api/activities");
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities?.slice(0, 3) || []); // Get top 3 recent activities
        }
      } catch (err) {
        console.error(err);
      } finally {
        setActivitiesLoading(false);
      }
    }

    fetchStats();
    fetchActivities();
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-6 font-sans">
      
      {/* ══ 1. IMMERSIVE HERO BANNER CARD ══ */}
      <div className="w-full h-[280px] bg-zinc-950 rounded-[32px] overflow-hidden shadow-xl shadow-emerald-950/10 border border-white/5 relative flex items-center justify-between">
        
        {/* Landscape backdrop hero image */}
        <div className="absolute inset-0">
          <Image
            src="/dashboard-banner.png"
            alt="Matahari terbit di puncak gunung"
            fill
            className="object-cover opacity-85"
            priority
          />
          {/* Subtle gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001712] via-[#001712]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001712]/50 to-transparent" />
        </div>

        {/* Content text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 p-8 max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col items-start gap-4"
        >
          <div>
            <Text variant="h1" className="text-white text-3xl font-extrabold leading-tight tracking-tight">
              Selamat Datang kembali,
              <br />
              <span className="text-[#ea580c]">Dhaafin Makhalingga</span>
            </Text>
            <Text variant="body" className="text-slate-300 mt-2 text-sm leading-relaxed max-w-md">
              Kelola database anggota, jadwal pendakian, ekspedisi konservasi, absensi, serta galeri kegiatan Pencinta Alam SMK Kimia PGRI Serang.
            </Text>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/acara">
              <Button variant="secondary" className="py-2.5 px-5 font-bold shadow-md shadow-[#ea580c]/25 rounded-2xl">
                Buat Kegiatan
              </Button>
            </Link>
            <Link href="/dashboard/anggota">
              <Button variant="ghost" className="py-2.5 px-5 font-semibold text-white border border-white/20 hover:bg-white/10 rounded-2xl">
                Kelola Anggota
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ══ 2. STATISTICS ROW ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Total Anggota",
            value: stats.total,
            desc: "Semua pendaftar terdata",
            bg: "bg-[#0b5c46]",
            text: "text-white",
            mutedText: "text-emerald-200/75",
            icon: (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )
          },
          {
            title: "Anggota Aktif",
            value: stats.approved,
            desc: "Pendaftaran disetujui",
            bg: "bg-emerald-600",
            text: "text-white",
            mutedText: "text-emerald-100/75",
            icon: (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          {
            title: "Menunggu Approval",
            value: stats.pending,
            desc: "Butuh verifikasi guru",
            bg: "bg-indigo-600",
            text: "text-white",
            mutedText: "text-indigo-100/75",
            icon: (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          {
            title: "Pendaftaran Ditolak",
            value: stats.rejected,
            desc: "Siswa ditolak gabung",
            bg: "bg-[#ea580c]",
            text: "text-white",
            mutedText: "text-orange-100/75",
            icon: (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          }
        ].map((c, i) => (
          <div key={i} className={`${c.bg} ${c.text} rounded-[24px] p-5 shadow-lg shadow-[#001712]/5 flex flex-col justify-between h-[135px] border border-white/5 relative overflow-hidden`}>
            <div className="flex items-center justify-between">
              <Text variant="caption" className={`${c.mutedText} font-bold`}>{c.title}</Text>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                {c.icon}
              </div>
            </div>
            <div>
              <span className="text-3xl font-black">{loading ? "..." : c.value}</span>
              <span className={`block text-[10px] ${c.mutedText} font-medium mt-1 uppercase tracking-wide`}>{c.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ══ 3. MAIN CONTENTS SECTION ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent activities table (col-span-2) */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-[32px] p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="h3" className="text-[#002d23] font-bold">Kegiatan Terbaru</Text>
              <Text variant="caption" color="muted">Jadwal agenda petualangan & ekspedisi terdekat</Text>
            </div>
            <Link href="/dashboard/acara">
              <Text variant="caption" color="accent" className="font-bold hover:underline cursor-pointer">
                Lihat Semua
              </Text>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Acara</th>
                  <th className="py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Tanggal & Waktu</th>
                  <th className="py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {activitiesLoading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-zinc-400 font-medium">
                      Memuat data kegiatan...
                    </td>
                  </tr>
                ) : activities.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-zinc-400 font-medium">
                      Belum ada kegiatan yang dibuat.
                    </td>
                  </tr>
                ) : (
                  activities.map((act) => (
                    <tr key={act.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {act.imageUrl ? (
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-100 relative shrink-0">
                              <Image src={act.imageUrl} alt={act.title} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                              ⛰️
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-zinc-800 text-sm block leading-normal">{act.title}</span>
                            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">{act.category || "Ekspedisi"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold text-zinc-700 text-sm block">{act.date}</span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">{act.time || "WIB"}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-zinc-600 text-sm font-semibold">{act.location}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Quick Action Widgets & System Info */}
        <div className="flex flex-col gap-6">
          {/* Action Card */}
          <div className="bg-[#001712] text-white border border-white/5 rounded-[32px] p-6 shadow-md relative overflow-hidden flex flex-col gap-5 justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#ea580c]/10 border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c] mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <Text variant="h3" className="text-white font-bold">Verifikasi Cepat</Text>
              <Text variant="body" className="text-slate-400 mt-2 leading-relaxed">
                Ada {stats.pending} pendaftaran siswa baru yang masih tertunda dan memerlukan persetujuan Guru pembimbing.
              </Text>
            </div>
            <Link href="/dashboard/anggota">
              <Button variant="primary" className="w-full bg-[#0b5c46] hover:bg-[#094736] text-white font-bold rounded-2xl py-3 text-xs uppercase tracking-wide">
                Buka Approval Anggota
              </Button>
            </Link>
          </div>

          {/* Quick links Card */}
          <div className="bg-white border border-zinc-200/80 rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
            <Text variant="h3" className="text-[#002d23] font-bold">Tautan Cepat</Text>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Buat Acara Kegiatan", path: "/dashboard/acara" },
                { label: "Manajemen Akun Siswa", path: "/dashboard/anggota" },
                { label: "Lihat Log Ekspedisi", path: "/dashboard/ekspedisi" },
              ].map((link, idx) => (
                <Link key={idx} href={link.path} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#ea580c]/30 hover:bg-orange-50/5 transition-all group">
                  <span className="text-xs font-bold text-zinc-700 group-hover:text-zinc-900">{link.label}</span>
                  <svg className="w-4 h-4 text-zinc-400 group-hover:text-[#ea580c] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
