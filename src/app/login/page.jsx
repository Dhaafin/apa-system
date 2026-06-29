"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen flex bg-[#001f18] font-sans">
      {/* ── LEFT PANEL: Hero Image ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background Image */}
        <Image
          src="/login-hero.png"
          alt="Pendaki di puncak gunung saat matahari terbit"
          fill
          className="object-cover"
          priority
          sizes="55vw"
        />

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#001f18]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f18]/80 via-transparent to-[#001f18]/30" />

        {/* Bottom left branding overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 p-10 z-10"
        >
          <div className="max-w-md">
            <span className="inline-block bg-[#ea580c]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4">
              Pencinta Alam
            </span>
            <h1 className="text-3xl font-extrabold text-white leading-tight mb-3">
              Jelajahi Alam,
              <br />
              <span className="text-[#ea580c]">Temukan Dirimu.</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Bergabunglah bersama komunitas pencinta alam SMK Kimia PGRI Serang. 
              Setiap langkah adalah petualangan baru.
            </p>
          </div>
        </motion.div>

        {/* Subtle floating particles / firefly dots */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[30%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#ea580c]/60"
          />
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[50%] left-[60%] w-1 h-1 rounded-full bg-amber-400/50"
          />
          <motion.div
            animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[70%] left-[35%] w-1 h-1 rounded-full bg-[#ea580c]/40"
          />
        </div>
      </div>

      {/* ── RIGHT PANEL: Login Form ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Ambient background glow (subtle) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[30%] -right-[30%] w-[70%] h-[70%] rounded-full bg-[#002d23]/60 blur-[100px]" />
          <div className="absolute -bottom-[20%] -left-[20%] w-[50%] h-[50%] rounded-full bg-[#ea580c]/5 blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile-only branding (hidden on lg+) */}
          <div className="lg:hidden text-center mb-8">
            <span className="inline-block bg-[#ea580c]/90 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-3">
              Pencinta Alam
            </span>
            <p className="text-xs text-zinc-500">SMK Kimia PGRI Serang</p>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              Masuk ke akun anggota Anda untuk melanjutkan.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 text-sm font-medium flex items-center gap-3"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </motion.div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <Input
                label="Kata Sandi"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="text-[11px] text-[#ea580c] hover:text-[#fb923c] font-medium transition-colors cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 mt-1 text-sm font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">atau</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Register CTA */}
          <div className="text-center">
            <p className="text-sm text-zinc-500">
              Belum memiliki akun?
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-white font-semibold hover:text-[#ea580c] transition-colors group cursor-pointer"
            >
              Daftar Sebagai Anggota
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Bottom tagline */}
          <p className="text-center text-[10px] text-zinc-700 font-medium uppercase tracking-[0.15em] mt-10">
            Lestari Alamku, Jaya Sekolahku
          </p>
        </motion.div>
      </div>
    </div>
  );
}
