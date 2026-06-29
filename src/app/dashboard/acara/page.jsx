"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import DatePicker from "@/components/atoms/DatePicker";
import TimePicker from "@/components/atoms/TimePicker";
import Text from "@/components/atoms/Text";
import Image from "next/image";
import { useFlashMessage } from "@/context/FlashMessageContext";

const EMPTY_FORM = { name: "", description: "", date: "", time: "", imageUrl: "" };

export default function AcaraPage() {
  const showFlashMessage = useFlashMessage();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editFormData, setEditFormData] = useState(EMPTY_FORM);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState("");

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities");
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    const uploadResponse = await fetch(
      `/api/upload?filename=${encodeURIComponent(file.name)}`,
      { method: "POST", body: file }
    );
    if (!uploadResponse.ok) throw new Error("Gagal mengunggah gambar kegiatan.");
    const result = await uploadResponse.json();
    return result.url;
  };

  // ── CREATE ──────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const combinedDateTime = new Date(
        `${formData.date}T${formData.time || "00:00"}`
      );

      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          imageUrl,
          date: combinedDateTime.toISOString(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal membuat acara.");

      setFormData(EMPTY_FORM);
      setImageFile(null);
      setIsModalOpen(false);
      await fetchActivities();
      showFlashMessage("success", "Acara berhasil dibuat!");
    } catch (err) {
      setFormError(err.message);
      showFlashMessage("error", err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── OPEN EDIT ────────────────────────────────────────────────────────────────
  const openEdit = (activity) => {
    setSelectedActivity(activity);
    const d = new Date(activity.date);
    const dateStr = d.toISOString().slice(0, 10);
    const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    setEditFormData({
      name: activity.name,
      description: activity.description,
      date: dateStr,
      time: timeStr,
      imageUrl: activity.imageUrl || "",
    });
    setEditImageFile(null);
    setEditFormError("");
    setIsEditModalOpen(true);
  };

  // ── SAVE EDIT ────────────────────────────────────────────────────────────────
  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditFormError("");
    setEditSubmitting(true);

    try {
      let imageUrl = editFormData.imageUrl;
      if (editImageFile) imageUrl = await uploadImage(editImageFile);

      const combinedDateTime = new Date(
        `${editFormData.date}T${editFormData.time || "00:00"}`
      );

      const response = await fetch(`/api/activities/${selectedActivity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editFormData.name,
          description: editFormData.description,
          imageUrl,
          date: combinedDateTime.toISOString(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal memperbarui acara.");

      setIsEditModalOpen(false);
      setSelectedActivity(null);
      await fetchActivities();
      showFlashMessage("success", "Acara berhasil diperbarui!");
    } catch (err) {
      setEditFormError(err.message);
      showFlashMessage("error", err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  // ── OPEN DELETE CONFIRM ───────────────────────────────────────────────────────
  const openDelete = (activity) => {
    setActivityToDelete(activity);
    setIsDeleteModalOpen(true);
  };

  // ── CONFIRM DELETE ────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!activityToDelete) return;
    setDeleteSubmitting(true);

    try {
      const response = await fetch(`/api/activities/${activityToDelete.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal menghapus acara.");

      setIsDeleteModalOpen(false);
      setActivityToDelete(null);
      await fetchActivities();
      showFlashMessage("success", "Acara berhasil dihapus!");
    } catch (err) {
      showFlashMessage("error", err.message);
      setIsDeleteModalOpen(false);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // ── SHARED FORM JSX ───────────────────────────────────────────────────────────
  const renderForm = (data, setData, imageFileSetter, errorMsg) => (
    <div className="flex flex-col gap-5">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
          {errorMsg}
        </div>
      )}

      <Input
        label="Nama Kegiatan"
        placeholder="Contoh: Pendakian Gunung Gede"
        value={data.name}
        onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
        required
        inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c] placeholder:!text-zinc-500"
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Deskripsi Kegiatan
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          placeholder="Jelaskan detail tujuan, persyaratan, perlengkapan dll..."
          value={data.description}
          onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))}
          required
          rows={4}
          className="w-full px-4 py-3 text-sm rounded-xl border bg-black/20 text-white border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-transparent transition-all placeholder:text-zinc-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="Tanggal"
          value={data.date}
          onChange={(e) => setData((p) => ({ ...p, date: e.target.value }))}
          required
          inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c]"
        />
        <TimePicker
          label="Waktu Mulai"
          value={data.time}
          onChange={(e) => setData((p) => ({ ...p, time: e.target.value }))}
          required
          inputClassName="!bg-black/20 !border-white/10 !text-white focus:!ring-[#ea580c]"
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Foto Banner Kegiatan
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, imageFileSetter)}
          className="w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-emerald-400 hover:file:bg-white/10 cursor-pointer border border-white/10 rounded-xl p-1 bg-black/20"
        />
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* ══ IMMERSIVE HERO BANNER CARD ══ */}
      <div className="w-full min-h-[180px] sm:h-[200px] bg-zinc-950 rounded-[32px] overflow-hidden shadow-xl shadow-emerald-950/10 border border-white/5 relative flex items-center mb-8">
        <div className="absolute inset-0">
          <Image
            src="/dashboard-banner.png"
            alt="Matahari terbit di puncak gunung"
            fill
            className="object-cover opacity-85"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001712] via-[#001712]/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001712]/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <Text variant="h2" className="text-white font-extrabold tracking-tight font-heading">
              Jadwal &amp; Acara
            </Text>
            <Text variant="body" color="muted" className="text-slate-300 max-w-lg">
              Daftar rencana petualangan, latihan, dan agenda organisasi KAPALA.
            </Text>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              setFormData(EMPTY_FORM);
              setImageFile(null);
              setFormError("");
              setIsModalOpen(true);
            }}
            className="py-3 px-6 font-bold shadow-md shadow-[#ea580c]/25 rounded-2xl shrink-0 self-start sm:self-center"
          >
            Buat Acara Baru
          </Button>
        </div>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-medium bg-white rounded-3xl border border-zinc-200">
          Memuat daftar acara...
        </div>
      ) : activities.length === 0 ? (
        <div className="p-12 text-center text-zinc-400 font-medium bg-white rounded-3xl border border-zinc-200">
          Belum ada jadwal acara yang terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity) => {
            const formattedDate = new Date(activity.date).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={activity.id}
                className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Image Header */}
                {activity.imageUrl ? (
                  <div className="h-48 w-full overflow-hidden relative bg-zinc-100">
                    <img
                      src={activity.imageUrl}
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-[#002d23]/5 flex items-center justify-center text-5xl">
                    🏕️
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#002d23] mb-1">{activity.name}</h3>
                    <p className="text-xs font-semibold text-[#ea580c] mb-3">{formattedDate}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
                      {activity.description}
                    </p>
                  </div>

                  {/* Footer metadata + actions */}
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-zinc-500">
                      <span>👥</span> {activity.participantCount || 0} Siswa Terdaftar
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(activity)}
                        title="Edit acara"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[#002d23]/20 text-[#002d23] hover:bg-[#002d23]/5 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(activity)}
                        title="Hapus acara"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ CREATE MODAL ══ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Acara Kegiatan Baru"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={submitLoading}>
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={submitLoading || !formData.name || !formData.description || !formData.date || !formData.time}
              className="bg-[#004d3d] hover:bg-[#00382c]"
            >
              {submitLoading ? "Menyimpan..." : "Simpan Acara"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreate}>
          {renderForm(formData, setFormData, setImageFile, formError)}
        </form>
      </Modal>

      {/* ══ EDIT MODAL ══ */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Acara Kegiatan"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={editSubmitting}>
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSave}
              disabled={editSubmitting || !editFormData.name || !editFormData.description || !editFormData.date || !editFormData.time}
              className="bg-[#004d3d] hover:bg-[#00382c]"
            >
              {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleEditSave}>
          {renderForm(editFormData, setEditFormData, setEditImageFile, editFormError)}
        </form>
      </Modal>

      {/* ══ DELETE CONFIRM MODAL ══ */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Acara"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteSubmitting}>
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteConfirm}
              disabled={deleteSubmitting}
              className="!bg-red-600 hover:!bg-red-700"
            >
              {deleteSubmitting ? "Menghapus..." : "Ya, Hapus Acara"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <Text variant="body" className="text-white font-semibold mb-0.5">
                Tindakan ini tidak dapat dibatalkan
              </Text>
              <Text variant="caption" color="muted">
                Semua data terkait acara ini, termasuk daftar peserta, akan ikut terhapus secara permanen.
              </Text>
            </div>
          </div>

          {activityToDelete && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <Text variant="caption" color="muted" className="uppercase tracking-wider text-[10px] font-bold mb-1">
                Acara yang akan dihapus
              </Text>
              <Text variant="body" className="text-white font-bold">{activityToDelete.name}</Text>
              <Text variant="caption" color="muted">
                {new Date(activityToDelete.date).toLocaleDateString("id-ID", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric",
                })}
              </Text>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
