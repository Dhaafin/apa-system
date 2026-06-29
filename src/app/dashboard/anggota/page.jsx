"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Table from "@/components/atoms/Table";
import Text from "@/components/atoms/Text";
import Image from "next/image";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import CustomDropdown from "@/components/atoms/CustomDropdown";
import CustomDropdownWhite from "@/components/atoms/CustomDropdownWhite";
import { useFlashMessage } from "@/context/FlashMessageContext";

const KELAS_OPTIONS = [
  "X KIMIA 1", "X KIMIA 2", "X KIMIA 3", "X KIMIA 4",
  "XI KIMIA 1", "XI KIMIA 2",
  "XII KIMIA 1", "XII KIMIA 2",
];

export default function AnggotaPage() {
  const showFlashMessage = useFlashMessage();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [adminEmail, setAdminEmail] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", className: "", role: "SISWA" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", password: "", className: "", status: "", role: "SISWA" });
  const [editFormError, setEditFormError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

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
    async function fetchMe() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setAdminEmail(data.user.email || "");
            if (data.user.role !== "GURU") {
              router.push("/dashboard");
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchMe();
    fetchStudents();
  }, [router]);

  const handleAction = async (studentId, action) => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, action, adminEmail }),
      });
      if (response.ok) {
        if (action === "APPROVE") {
          showFlashMessage("success", "Pendaftaran siswa berhasil disetujui!");
        } else {
          showFlashMessage("warning", "Pendaftaran siswa telah ditolak.");
        }
        fetchStudents(); // Refresh data
      } else {
        showFlashMessage("error", "Gagal memperbarui status pendaftaran.");
      }
    } catch (err) {
      console.error(err);
      showFlashMessage("error", "Terjadi kesalahan koneksi.");
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat anggota baru");
      }
      setFormData({ name: "", email: "", password: "", className: "", role: "SISWA" });
      setIsModalOpen(false);
      showFlashMessage("success", "Anggota baru berhasil dibuat dan langsung diaktifkan!");
      fetchStudents();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      name: student.name || "",
      email: student.email || "",
      password: "", // Optional, blank by default
      className: student.class || "",
      status: student.status || "APPROVED",
      role: student.role || "SISWA",
    });
    setEditFormError("");
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    setEditFormError("");
    setEditSubmitting(true);
    try {
      const response = await fetch("/api/admin/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedStudent.id, ...editFormData }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui data anggota");
      }
      setIsEditModalOpen(false);
      showFlashMessage("success", `Data anggota ${editFormData.name} berhasil diperbarui!`);
      fetchStudents();
    } catch (err) {
      setEditFormError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteSubmitting(true);
    try {
      const response = await fetch(`/api/admin/students?id=${studentToDelete.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus anggota");
      }
      setIsDeleteModalOpen(false);
      showFlashMessage("success", `Anggota ${studentToDelete.name} berhasil dihapus.`);
      fetchStudents();
    } catch (err) {
      showFlashMessage("error", err.message);
    } finally {
      setDeleteSubmitting(false);
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
      render: (row) => {
        if (row.role === "GURU") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider text-[10px]">
              Guru
            </span>
          );
        }
        if (row.role === "KETUA") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wider text-[10px]">
              Ketua
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 uppercase tracking-wider text-[10px]">
            Siswa
          </span>
        );
      }
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
        return (
          <div className="flex gap-2 justify-end items-center">
            {row.status === "PENDING" && (
              <>
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
              </>
            )}
            {row.status === "APPROVED" && (
              <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">Aktif</span>
            )}
            {row.status === "REJECTED" && (
              <span className="text-[10px] text-red-600 font-extrabold bg-red-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">Ditolak</span>
            )}
            
            {/* Edit Button */}
            <button
              onClick={() => handleEditClick(row)}
              className="p-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-[#ea580c] hover:border-[#ea580c]/30 hover:bg-orange-50/5 transition-all cursor-pointer flex items-center justify-center"
              title="Edit Anggota"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteClick(row)}
              className="p-1.5 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:text-red-700 hover:bg-red-100 transition-all cursor-pointer flex items-center justify-center"
              title="Hapus Anggota"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 font-sans">
      
      {/* ══ IMMERSIVE HERO BANNER CARD ══ */}
      <div className="w-full min-h-[180px] sm:h-[200px] bg-zinc-950 rounded-[32px] overflow-hidden shadow-xl shadow-emerald-950/10 border border-white/5 relative flex items-center">
        
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#001712] via-[#001712]/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001712]/50 to-transparent" />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 w-full p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <Text variant="h2" className="text-white font-extrabold tracking-tight font-heading">
              Manajemen Anggota
            </Text>
            <Text variant="body" color="muted" className="text-slate-300 max-w-lg">
              Daftar lengkap siswa pencinta alam aktif dan persetujuan registrasi anggota baru.
            </Text>
          </div>

          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-6 font-bold shadow-md shadow-[#ea580c]/25 rounded-2xl shrink-0 self-start sm:self-center"
          >
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
          <CustomDropdownWhite
            label="Kelas:"
            options={classes}
            value={selectedClass}
            onChange={setSelectedClass}
            placeholder="Semua Kelas"
          />

          <CustomDropdownWhite
            label="Status:"
            options={["ALL", "PENDING", "APPROVED", "REJECTED"]}
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="Semua Status"
          />
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

      {/* ══ CREATE MEMBER MODAL ══ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormError("");
          setFormData({ name: "", email: "", password: "", className: "" });
        }}
        title="Tambah Anggota Baru"
        footer={
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setFormError("");
                setFormData({ name: "", email: "", password: "", className: "" });
              }}
              className="flex-1 sm:flex-initial py-2.5 px-5 font-semibold text-zinc-500 border border-zinc-200 rounded-2xl hover:bg-zinc-50"
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              variant="secondary"
              onClick={handleCreateMember}
              className="flex-1 sm:flex-initial py-2.5 px-6 font-bold shadow-md shadow-[#ea580c]/15 rounded-2xl"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Anggota"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateMember} className="space-y-4">
          {formError && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-900/50 text-red-400 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{formError}</span>
            </div>
          )}
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap siswa..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c] placeholder:!text-zinc-500"
            icon={
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <Input
            label="Alamat Email"
            type="email"
            placeholder="contoh: siswa@sekolah.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c] placeholder:!text-zinc-500"
            icon={
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <Input
            label="Password Akun"
            type="password"
            placeholder="Minimal 6 karakter..."
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c] placeholder:!text-zinc-500"
            icon={
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          <CustomDropdown
            label="Kelas"
            options={KELAS_OPTIONS}
            value={formData.className}
            onChange={(val) => setFormData({ ...formData, className: val })}
            placeholder="Pilih kelas siswa..."
            required
            direction="down"
          />
          <CustomDropdown
            label="Jabatan (Role)"
            options={["SISWA", "KETUA", "GURU"]}
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val })}
            placeholder="Pilih jabatan..."
            required
            direction="up"
          />
        </form>
      </Modal>

      {/* ══ EDIT MEMBER MODAL ══ */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditFormError("");
          setSelectedStudent(null);
        }}
        title="Edit Data Anggota"
        footer={
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditFormError("");
                setSelectedStudent(null);
              }}
              className="flex-1 sm:flex-initial py-2.5 px-5 font-semibold text-zinc-500 border border-zinc-200 rounded-2xl hover:bg-zinc-50"
              disabled={editSubmitting}
            >
              Batal
            </Button>
            <Button
              variant="secondary"
              onClick={handleUpdateMember}
              className="flex-1 sm:flex-initial py-2.5 px-6 font-bold shadow-md shadow-[#ea580c]/15 rounded-2xl"
              disabled={editSubmitting}
            >
              {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleUpdateMember} className="space-y-4">
          {editFormError && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-900/50 text-red-400 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{editFormError}</span>
            </div>
          )}
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap siswa..."
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            required
            inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c] placeholder:!text-zinc-500"
            icon={
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <Input
            label="Alamat Email"
            type="email"
            placeholder="contoh: siswa@sekolah.com"
            value={editFormData.email}
            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            required
            inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c] placeholder:!text-zinc-500"
            icon={
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <Input
            label="Password Akun (Opsional)"
            type="password"
            placeholder="Isi hanya jika ingin mengganti password..."
            value={editFormData.password}
            onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
            inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c] placeholder:!text-zinc-500"
            icon={
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          <CustomDropdown
            label="Kelas"
            options={KELAS_OPTIONS}
            value={editFormData.className}
            onChange={(val) => setEditFormData({ ...editFormData, className: val })}
            placeholder="Pilih kelas siswa..."
            required
            direction="down"
          />
          <CustomDropdown
            label="Jabatan (Role)"
            options={["SISWA", "KETUA", "GURU"]}
            value={editFormData.role}
            onChange={(val) => setEditFormData({ ...editFormData, role: val })}
            placeholder="Pilih jabatan..."
            required
            direction="down"
          />
          <CustomDropdown
            label="Status Keanggotaan"
            options={["PENDING", "APPROVED", "REJECTED"]}
            value={editFormData.status}
            onChange={(val) => setEditFormData({ ...editFormData, status: val })}
            placeholder="Pilih status..."
            required
            direction="up"
          />
        </form>
      </Modal>

      {/* ══ DELETE CONFIRMATION MODAL ══ */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        title="Konfirmasi Hapus Anggota"
        footer={
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setStudentToDelete(null);
              }}
              className="flex-1 sm:flex-initial py-2.5 px-5 font-semibold text-zinc-500 border border-zinc-200 rounded-2xl hover:bg-zinc-50"
              disabled={deleteSubmitting}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteConfirm}
              className="flex-1 sm:flex-initial py-2.5 px-6 font-bold bg-red-600 hover:bg-red-700 text-white rounded-2xl"
              disabled={deleteSubmitting}
            >
              {deleteSubmitting ? "Menghapus..." : "Ya, Hapus Anggota"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-center py-4">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/35 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <Text variant="h3" className="text-white font-extrabold">
            Apakah Anda yakin?
          </Text>
          <Text variant="body" className="text-slate-300 max-w-sm mx-auto leading-relaxed">
            Tindakan ini akan menghapus data keanggotaan milik <strong className="text-white font-bold">{studentToDelete?.name}</strong> ({studentToDelete?.email}) secara permanen dari sistem database.
          </Text>
        </div>
      </Modal>
    </div>
  );
}
