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
    <div className="min-h-screen flex items-center justify-center bg-[#000f0c] px-4 py-12 relative overflow-hidden font-sans">
      {/* Animated Glowing Orbs for Luxury Look */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
          className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#004d3d]/30 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#ea580c]/12 blur-[130px]"
        />
      </div>

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="w-full max-w-md bg-zinc-950/50 backdrop-blur-3xl border border-zinc-800/85 p-9 rounded-[36px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative z-10"
      >
        {/* Glow border ring */}
        <div className="absolute inset-0 rounded-[36px] border border-emerald-500/10 pointer-events-none" />

        {!success ? (
          <>
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -6 }}
                className="w-20 h-20 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-[#ea580c]/20"
              >
                {/* SVG Mountain Peak Icon replacing emoji */}
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </motion.div>
              
              <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Daftar Anggota
              </h1>
              <p className="text-xs font-bold text-[#ea580c] mt-2 tracking-[0.2em] uppercase">
                KAPALA - SMK KIMIA PGRI SERANG
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-800/60 text-red-200 text-sm font-medium"
              >
                {error}
              </motion.div>
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
                className="w-full py-4 mt-2 bg-[#004d3d] hover:bg-[#0b5c46] cursor-pointer text-sm font-extrabold uppercase tracking-widest rounded-2xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Mendaftar..." : "Buat Akun Siswa"}
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-400 mt-6">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="text-[#ea580c] font-extrabold hover:text-[#f97316] transition-colors ml-1">
                Masuk di sini
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/5">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">REGISTRASI BERHASIL</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
              Akun Anda telah dibuat dengan status <strong className="text-[#ea580c]">PENDING</strong>. Silakan hubungi Guru pembimbing
              KAPALA untuk menyetujui akun Anda agar bisa masuk ke sistem.
            </p>
            
            <Link href="/login">
              <Button variant="outline" className="w-full cursor-pointer py-3.5 text-xs font-bold uppercase tracking-wider">
                Kembali ke Halaman Login
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
