"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import DatePicker from "@/components/atoms/DatePicker";
import TimePicker from "@/components/atoms/TimePicker";

export default function AcaraPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitLoading(true);

    try {
      let imageUrl = "";

      // 1. Upload file if selected
      if (imageFile) {
        const uploadResponse = await fetch(`/api/upload?filename=${encodeURIComponent(imageFile.name)}`, {
          method: "POST",
          body: imageFile,
        });

        if (!uploadResponse.ok) {
          throw new Error("Gagal mengunggah gambar kegiatan.");
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.url;
      }

      // 2. Combine date & time into a single Date object
      const combinedDateTime = new Date(`${date}T${time || "00:00"}`);

      // 3. Create Activity record
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          imageUrl,
          date: combinedDateTime.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat acara.");
      }

      // 4. Reset form & refresh list
      setName("");
      setDescription("");
      setDate("");
      setTime("");
      setImageFile(null);
      setIsModalOpen(false);
      fetchActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Block */}
      <div className="flex items-center justify-between mb-8 bg-white border border-zinc-200/85 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#004d3d] text-2xl font-bold">📅</span>
            <h1 className="text-2xl font-extrabold text-[#002d23]">Jadwal & Acara</h1>
          </div>
          <p className="text-sm text-zinc-500">
            Daftar rencana petualangan, latihan, dan agenda organisasi KAPALA
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#004d3d] hover:bg-[#0b5c46] cursor-pointer"
        >
          <span>+</span> Buat Acara Baru
        </Button>
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

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-zinc-500">
                      <span>👥</span> {activity.participantCount || 0} Siswa Terdaftar
                    </div>
                    <Button variant="outline" className="py-2 px-4 text-xs">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE ACTIVITY MODAL */}
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
              onClick={handleSubmit}
              disabled={submitLoading || !name || !description || !date || !time}
              className="bg-[#004d3d] hover:bg-[#00382c]"
            >
              {submitLoading ? "Menyimpan..." : "Simpan Acara"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          <Input
            label="Nama Kegiatan"
            placeholder="Contoh: Pendakian Gunung Gede"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Deskripsi Kegiatan
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              placeholder="Jelaskan detail tujuan, persyaratan, perlengkapan dll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 text-sm rounded-xl border bg-white text-zinc-900 border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#004d3d] focus:border-transparent transition-all placeholder:text-zinc-400 dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label="Tanggal"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <TimePicker
              label="Waktu Mulai"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Image File Upload Selection */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Foto Banner Kegiatan
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-zinc-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#002d23]/5 file:text-[#004d3d] hover:file:bg-[#002d23]/10 cursor-pointer border border-zinc-200 rounded-xl p-1"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
