"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Table from "@/components/atoms/Table";
import Text from "@/components/atoms/Text";
import Image from "next/image";

export default function AnggotaPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [adminEmail, setAdminEmail] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/admin/students");
      if (!response.ok) {
        throw new Error("Failed to load students");
      }
      const data = await response.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAdminEmail("muhammadfc44@gmail.com");
    fetchStudents();
  }, []);

  const handleAction = async (studentId, action) => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, action, adminEmail }),
      });
      if (response.ok) {
        fetchStudents(); // Refresh data
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Extract unique classes for filter
  const classes = ["ALL", ...new Set(students.map((s) => s.class).filter(Boolean))];

  // Filtering Logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "ALL" || s.class === selectedClass;
    const matchesStatus = selectedStatus === "ALL" || s.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Table header definitions
  const tableHeaders = [
    {
      key: "index",
      label: "No",
      className: "w-[70px]",
      render: (_, idx) => (
        <span className="text-zinc-400 font-semibold">{idx + 1}</span>
      )
    },
    {
      key: "name",
      label: "Nama Lengkap",
      render: (row) => (
        <div>
          <span className="font-bold text-zinc-800 text-sm block">{row.name}</span>
          <span className="text-xs text-zinc-400 font-medium">{row.email}</span>
        </div>
      )
    },
    {
      key: "class",
      label: "Kelas",
      render: (row) => (
        <span className="font-bold text-zinc-600 text-sm">{row.class || "-"}</span>
      )
    },
    {
      key: "role",
      label: "Jabatan",
      render: () => (
        <span className="font-bold text-zinc-400 text-xs uppercase tracking-wide">Anggota</span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        if (row.status === "PENDING") {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Pending
            </span>
          );
        }
        if (row.status === "APPROVED") {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Aktif
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Ditolak
          </span>
        );
      }
    },
    {
      key: "actions",
      label: "Aksi",
      align: "right",
      render: (row) => {
        if (row.status === "PENDING") {
          return (
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleAction(row.id, "APPROVE")}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100/80 transition-all font-bold text-xs cursor-pointer"
                title="Setujui"
              >
                ✓ Setuju
              </button>
              <button
                onClick={() => handleAction(row.id, "REJECT")}
                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100/80 transition-all font-bold text-xs cursor-pointer"
                title="Tolak"
              >
                ✗ Tolak
              </button>
            </div>
          );
        }
        if (row.status === "APPROVED") {
          return (
            <span className="text-xs text-zinc-400 font-bold italic">Terverifikasi</span>
          );
        }
        return (
          <span className="text-xs text-red-400 font-bold italic">Ditolak</span>
        );
      }
    }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 font-sans">
      
      {/* ══ IMMERSIVE HERO BANNER CARD ══ */}
      <div className="w-full h-[220px] bg-zinc-950 rounded-[32px] overflow-hidden shadow-xl shadow-emerald-950/10 border border-white/5 relative flex items-center justify-between">
        
        {/* Landscape backdrop hero image */}
        <div className="absolute inset-0">
          <Image
            src="/anggota-banner.png"
            alt="Pendaki di jalan setapak hutan"
            fill
            className="object-cover opacity-85"
            priority
          />
          {/* Subtle gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001712] via-[#001712]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001712]/50 to-transparent" />
        </div>

        {/* Content text */}
        <div className="relative z-10 p-8 max-w-lg md:max-w-xl lg:max-w-2xl flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#ea580c] text-2xl font-bold">👥</span>
              <Text variant="h2" className="text-white font-extrabold leading-tight tracking-tight">Manajemen Anggota</Text>
            </div>
            <Text variant="body" className="text-slate-300 mt-1 text-sm leading-relaxed max-w-md">
              Daftar lengkap siswa pencinta alam aktif dan persetujuan registrasi anggota baru.
            </Text>
          </div>

          <Button variant="secondary" className="py-2.5 px-5 font-bold shadow-md shadow-[#ea580c]/25 rounded-2xl shrink-0 hidden sm:flex">
            Tambah Anggota
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-zinc-200/80 p-6 rounded-[32px] shadow-sm flex flex-col gap-4">
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-zinc-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Cari anggota berdasarkan nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm rounded-2xl transition-all"
          />
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Text variant="caption" color="muted" className="font-bold">Kelas:</Text>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-[#ea580c]"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls === "ALL" ? "Semua Kelas" : cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Text variant="caption" color="muted" className="font-bold">Status:</Text>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-[#ea580c]"
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <Table
        headers={tableHeaders}
        data={filteredStudents.map((s, idx) => ({ ...s, index: idx }))}
        loading={loading}
        emptyMessage="Tidak ada data anggota ditemukan"
        className="bg-white"
      />
    </div>
  );
}
