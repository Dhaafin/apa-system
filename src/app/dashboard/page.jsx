"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";

export default function DashboardPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [adminEmail, setAdminEmail] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/admin/students");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load students");
      }
      const data = await response.json();
      setStudents(data.students || []);
      setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    // Decode session from cookie/request (simplified client check)
    // To identify admin email, we fetch it or mock from state
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

  return (
    <div className="min-h-screen bg-zinc-50 flex text-zinc-900 font-sans">
      {/* LEFT SIDEBAR */}
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
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left">
              <span>📊</span> Dashboard
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] shadow-lg shadow-[#ea580c]/15 transition-all text-left">
              <span>👥</span> Manajemen Anggota
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left">
              <span>📅</span> Jadwal & Kegiatan
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left">
              <span>🧭</span> Log Ekspedisi
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left">
              <span>🖼️</span> Galeri Foto
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left">
              <span>⚙️</span> Pengaturan
            </button>
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {/* Header Block */}
        <div className="flex items-center justify-between mb-8 bg-white border border-zinc-200/85 p-6 rounded-3xl shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#004d3d] text-2xl font-bold">👥</span>
              <h1 className="text-2xl font-extrabold text-[#002d23]">Manajemen Anggota</h1>
            </div>
            <p className="text-sm text-zinc-500">
              Daftar lengkap siswa pencinta alam aktif dan persetujuan registrasi
            </p>
          </div>
          <Button variant="primary" className="bg-[#004d3d] hover:bg-[#0b5c46]">
            <span>+</span> Tambah Anggota Baru
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Anggota</span>
            <span className="text-3xl font-black text-zinc-900">{stats.total}</span>
          </div>
          <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Anggota Aktif</span>
            <span className="text-3xl font-black text-emerald-600">{stats.approved}</span>
          </div>
          <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Menunggu Approval</span>
            <span className="text-3xl font-black text-amber-500">{stats.pending}</span>
          </div>
          <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ditolak</span>
            <span className="text-3xl font-black text-red-500">{stats.rejected}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm mb-6 flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari anggota berdasarkan nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#004d3d] focus:border-transparent text-sm rounded-2xl transition-all"
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 outline-none focus:ring-2 focus:ring-[#004d3d]"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls === "ALL" ? "Semua Kelas" : cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 outline-none focus:ring-2 focus:ring-[#004d3d]"
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
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden flex-1">
          {loading ? (
            <div className="p-12 text-center text-zinc-500 font-medium">Memuat data anggota...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 font-medium">
              Tidak ada data anggota ditemukan.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="py-4 px-6">No</th>
                  <th className="py-4 px-6">Nama Lengkap</th>
                  <th className="py-4 px-6">Kelas</th>
                  <th className="py-4 px-6">Jabatan Organisasi</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150">
                {filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-zinc-400 font-medium">{idx + 1}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-zinc-900">{student.name}</td>
                    <td className="py-4 px-6 text-sm font-medium text-zinc-600">{student.class}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-zinc-500">Anggota</td>
                    <td className="py-4 px-6">
                      {student.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending
                        </span>
                      )}
                      {student.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      )}
                      {student.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Ditolak
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {student.status === "PENDING" && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleAction(student.id, "APPROVE")}
                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all font-bold text-xs"
                            title="Setujui"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleAction(student.id, "REJECT")}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all font-bold text-xs"
                            title="Tolak"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                      {student.status === "APPROVED" && (
                        <span className="text-xs text-zinc-400 font-semibold italic">Terverifikasi</span>
                      )}
                      {student.status === "REJECTED" && (
                        <span className="text-xs text-red-400 font-semibold italic">Ditolak</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
