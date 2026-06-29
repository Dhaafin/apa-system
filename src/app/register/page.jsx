"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import CustomDropdown from "@/components/atoms/CustomDropdown";

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
    <div className="min-h-screen flex items-center justify-center bg-[#001f18] px-4 py-12 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[#004d3d]/30 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-[#ea580c]/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-3xl shadow-2xl relative z-10">
        {!success ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#ea580c]/20">
                {/* SVG Mountain Peak Icon replacing emoji */}
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">Daftar Anggota</h1>
              <p className="text-xs font-bold text-[#eab308] mt-1 tracking-widest uppercase">
                KAPALA - SMK KIMIA PGRI SERANG
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-sm">
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

              {/* Custom Dropdown select box */}
              <CustomDropdown
                label="Kelas"
                options={KELAS_OPTIONS}
                value={selectedClass}
                onChange={setSelectedClass}
                placeholder="Pilih Kelas Anda"
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 mt-2 bg-[#004d3d] hover:bg-[#0b5c46] cursor-pointer"
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
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
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
            <h2 className="text-2xl font-bold text-white mb-3">Registrasi Berhasil!</h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              Akun Anda telah dibuat dengan status <strong>PENDING</strong>. Silakan hubungi Guru pembimbing
              untuk menyetujui akun Anda agar bisa masuk ke sistem.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full cursor-pointer">
                Kembali ke Halaman Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
