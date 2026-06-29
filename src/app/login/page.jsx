"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Email atau kata sandi salah");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000f0c] px-4 relative overflow-hidden font-sans">
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

        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 6 }}
            className="w-20 h-20 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-[#ea580c]/20"
          >
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
                d="M12 2L2 22h20L12 2zM12 5l6.5 13H5.5L12 5zm0 8v5"
              />
            </svg>
          </motion.div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            SIPA ADVENTURE
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Alamat Email"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Kata Sandi"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 mt-2 bg-[#004d3d] hover:bg-[#0b5c46] cursor-pointer text-sm font-extrabold uppercase tracking-widest rounded-2xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk ke Akun"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-800/80 pt-6">
          <p className="text-xs text-zinc-400">
            Belum terdaftar sebagai anggota?{" "}
            <Link href="/register" className="text-[#ea580c] font-extrabold hover:text-[#f97316] transition-colors ml-1">
              Daftar Baru
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-zinc-600 font-extrabold tracking-widest uppercase mt-6">
          Lestari Alamku, Jaya Sekolahku!
        </p>
      </motion.div>
    </div>
  );
}
