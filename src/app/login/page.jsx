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
    <div className="min-h-screen flex items-center justify-center bg-[#001f18] px-4 relative overflow-hidden font-sans">
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Pencinta Alam
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
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
            className="w-full py-3.5 mt-2 bg-[#004d3d] hover:bg-[#0b5c46] cursor-pointer text-sm font-semibold transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk ke Akun"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-800/80 pt-6">
          <p className="text-xs text-zinc-400">
            Belum terdaftar sebagai anggota?{" "}
            <Link href="/register" className="text-[#ea580c] font-bold hover:underline ml-1">
              Daftar Baru
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-6">
          Lestari Alamku, Jaya Sekolahku!
        </p>
      </motion.div>
    </div>
  );
}
