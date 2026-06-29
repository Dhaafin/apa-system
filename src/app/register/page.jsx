"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import CustomDropdown from "@/components/atoms/CustomDropdown";
import { motion } from "framer-motion";

const KELAS_OPTIONS = [
  "X KIMIA 1",
  "X KIMIA 2",
  "X KIMIA 3",
  "X KIMIA 4",
  "XI KIMIA 1",
  "XI KIMIA 2",
  "XII KIMIA 1",
  "XII KIMIA 2",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedClass) {
      setError("Silakan pilih kelas Anda");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, class: selectedClass }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registrasi gagal");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001f18] px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Gradient Ambient Orbs (Static for Lightweight performance) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[#002d23]/50 blur-[130px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-[#ea580c]/8 blur-[130px]" />
      </div>

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        {!success ? (
          <>
            <div className="text-center mb-8">
              {/* Secondary Accent Header Badge */}
              <div className="inline-block bg-[#ea580c] text-white px-5 py-2 rounded-2xl font-bold text-sm tracking-wide shadow-md shadow-[#ea580c]/20 mb-3">
                Daftar Anggota
              </div>
              <p className="text-xs text-zinc-400">
                SMK Kimia PGRI Serang
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-red-200 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Alamat Email Siswa"
                type="email"
                placeholder="email@sekolah.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Kata Sandi"
                type="password"
                placeholder="Buat kata sandi baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Custom Dropdown select box - pops up upwards */}
              <CustomDropdown
                label="Kelas"
                options={KELAS_OPTIONS}
                value={selectedClass}
                onChange={setSelectedClass}
                placeholder="Pilih Kelas Anda"
                required
                direction="up"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 mt-2 bg-[#004d3d] hover:bg-[#0b5c46] cursor-pointer text-sm font-semibold transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Mendaftar..." : "Buat Akun Siswa"}
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-400 mt-6">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="text-[#ea580c] font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Registrasi Berhasil</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Akun Anda telah dibuat dengan status <strong className="text-[#ea580c]">PENDING</strong>. Silakan hubungi Guru pembimbing
              KAPALA untuk menyetujui akun Anda agar bisa masuk ke sistem.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full cursor-pointer py-3 text-xs font-semibold">
                Kembali ke Halaman Login
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
