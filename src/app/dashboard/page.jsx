"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

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
    fetchStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Block */}
      <div className="flex items-center justify-between mb-8 bg-white border border-zinc-200/85 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#004d3d] text-2xl font-bold">📊</span>
            <h1 className="text-2xl font-extrabold text-[#002d23]">Dashboard Ikhtisar</h1>
          </div>
          <p className="text-sm text-zinc-500">
            Selamat datang kembali! Berikut adalah ringkasan cepat data organisasi SIPA Adventure.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Anggota</span>
          <span className="text-3xl font-black text-zinc-900">{loading ? "..." : stats.total}</span>
        </div>
        <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Anggota Aktif</span>
          <span className="text-3xl font-black text-emerald-600">{loading ? "..." : stats.approved}</span>
        </div>
        <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Menunggu Approval</span>
          <span className="text-3xl font-black text-amber-500">{loading ? "..." : stats.pending}</span>
        </div>
        <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ditolak</span>
          <span className="text-3xl font-black text-red-500">{loading ? "..." : stats.rejected}</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#002d23] mb-2 flex items-center gap-2">
              <span>👥</span> Kelola Anggota
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Lihat, saring, dan setujui pendaftaran siswa baru yang ingin bergabung ke dalam unit kegiatan
              pencinta alam KAPALA.
            </p>
          </div>
          <Link href="/dashboard/anggota">
            <Button variant="outline" className="w-fit">
              Buka Manajemen Anggota
            </Button>
          </Link>
        </div>

        <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#002d23] mb-2 flex items-center gap-2">
              <span>📅</span> Agenda & Acara
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Jadwalkan petualangan baru, pendakian gunung, latihan fisik, rapat organisasi, dan pantau siswa mana
              saja yang ikut serta.
            </p>
          </div>
          <Link href="/dashboard/acara">
            <Button variant="outline" className="w-fit">
              Lihat Jadwal & Acara
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
