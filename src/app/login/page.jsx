"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import CustomDropdown from "@/components/atoms/CustomDropdown";
import { motion, AnimatePresence } from "framer-motion";

const KELAS_OPTIONS = [
  "X KIMIA 1", "X KIMIA 2", "X KIMIA 3", "X KIMIA 4",
  "XI KIMIA 1", "XI KIMIA 2",
  "XII KIMIA 1", "XII KIMIA 2",
];

/* ─── Shared spinner ─── */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ─── Error Alert ─── */
function ErrorAlert({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center gap-3"
    >
      <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <Text variant="caption" color="danger">{message}</Text>
    </motion.div>
  );
}

/* ─── Login Form ─── */
function LoginForm({ onSwitch }) {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Email atau kata sandi salah");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-7">
        <Text variant="h2">Selamat Datang</Text>
        <Text variant="body" color="muted" className="mt-1.5">
          Masuk ke akun anggota Anda untuk melanjutkan.
        </Text>
      </div>

      {error && <ErrorAlert message={error} />}

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
              className="cursor-pointer transition-colors"
            >
              <Text variant="caption" color="accent" className="hover:text-[#fb923c]">
                Lupa kata sandi?
              </Text>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3.5 mt-1 text-sm font-semibold"
          disabled={loading}
        >
          {loading ? <><Spinner /> Memproses...</> : "Masuk"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Text variant="caption" color="muted">
          Belum memiliki akun?{" "}
          <button
            onClick={onSwitch}
            className="text-[#ea580c] font-bold hover:text-[#fb923c] transition-colors cursor-pointer"
          >
            Daftar sekarang
          </button>
        </Text>
      </div>
    </>
  );
}

/* ─── Register Form ─── */
function RegisterForm({ onSwitch }) {
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
    if (!selectedClass) { setError("Silakan pilih kelas Anda"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, class: selectedClass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registrasi gagal");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <Text variant="h3" className="mb-3">Pendaftaran Berhasil!</Text>
        <Text variant="body" color="muted" className="leading-relaxed mb-6">
          Akun Anda telah dibuat dengan status{" "}
          <strong className="text-[#ea580c]">PENDING</strong>.{" "}
          Hubungi Guru pembimbing KAPALA untuk persetujuan akun.
        </Text>
        <button
          onClick={onSwitch}
          className="w-full py-3 rounded-xl border border-slate-600 hover:border-[#ea580c]/60 transition-all duration-200 cursor-pointer"
        >
          <Text variant="caption" color="muted" className="hover:text-[#ea580c]">
            Kembali ke Halaman Masuk
          </Text>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3.5">
        <Text variant="h2">Daftar Anggota</Text>
        <Text variant="body" color="muted" className="mt-1">
          Buat akun siswa baru untuk Pencinta Alam.
        </Text>
      </div>

      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="!gap-1"
        />
        <Input
          label="Email Siswa"
          type="email"
          placeholder="email@sekolah.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="!gap-1"
        />
        <Input
          label="Kata Sandi"
          type="password"
          placeholder="Buat kata sandi baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="!gap-1"
        />
        <CustomDropdown
          label="Kelas"
          options={KELAS_OPTIONS}
          value={selectedClass}
          onChange={setSelectedClass}
          placeholder="Pilih Kelas Anda"
          required
          direction="up"
          className="!gap-1"
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 mt-1 text-sm font-semibold"
          disabled={loading}
        >
          {loading ? <><Spinner /> Mendaftar...</> : "Buat Akun Siswa"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Text variant="caption" color="muted">
          Sudah punya akun?{" "}
          <button
            onClick={onSwitch}
            className="text-[#ea580c] font-bold hover:text-[#fb923c] transition-colors cursor-pointer"
          >
            Masuk di sini
          </button>
        </Text>
      </div>
    </>
  );
}

/* ─── Main Page ─── */
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  const switchToRegister = () => setActiveTab("register");
  const switchToLogin    = () => setActiveTab("login");

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex bg-[#001f18]" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ══ LEFT PANEL: Cinematic Hero ══ */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <Image
          src="/login-hero.png"
          alt="Pendaki di puncak gunung saat matahari terbit"
          fill
          className="object-cover"
          priority
          sizes="55vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d1f2d]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f18]/80 via-transparent to-[#001f18]/20" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 p-10 z-10"
        >
          <div className="max-w-md">
            <Text variant="badge" className="inline-block bg-[#ea580c]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full mb-4">
              Pencinta Alam
            </Text>
            <Text variant="h1" className="leading-tight mb-3">
              Jelajahi Alam,
              <br />
              <span className="text-[#ea580c]">Temukan Dirimu.</span>
            </Text>
            <Text variant="body" className="text-white/55 max-w-sm">
              Bergabunglah bersama komunitas pencinta alam SMK Kimia PGRI Serang.
              Setiap langkah adalah petualangan baru.
            </Text>
          </div>
        </motion.div>

        {/* Firefly particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { top: "30%", left: "20%", size: "w-1.5 h-1.5", dur: 5,  delay: 0, color: "bg-[#ea580c]/60" },
            { top: "50%", left: "60%", size: "w-1 h-1",     dur: 7,  delay: 1, color: "bg-amber-400/50" },
            { top: "70%", left: "35%", size: "w-1 h-1",     dur: 4,  delay: 2, color: "bg-[#ea580c]/40" },
          ].map((p, i) => (
            <motion.div
              key={i}
              style={{ top: p.top, left: p.left, position: "absolute" }}
              animate={{ y: [0, -14, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
              className={`${p.size} rounded-full ${p.color}`}
            />
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL: Auth Forms ══ */}
      <div
        className="w-full lg:w-[45%] lg:h-screen lg:overflow-hidden flex items-center justify-center px-6 py-8 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0d1f2d 0%, #0f2318 40%, #1a1a2e 100%)" }}
      >
        {/* Mesh gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[25%] -right-[25%] w-[60%] h-[60%] rounded-full bg-[#004d3d]/30 blur-[90px]" />
          <div className="absolute -bottom-[20%] -left-[15%] w-[55%] h-[55%] rounded-full bg-[#ea580c]/8 blur-[90px]" />
          <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-[#1a1a4e]/40 blur-[80px]" />
        </div>

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10 flex flex-col justify-center"
        >
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-5">
            <Text variant="badge" className="inline-block bg-[#ea580c]/90 text-white px-3 py-1.5 rounded-full mb-1">
              Pencinta Alam
            </Text>
            <Text variant="caption" color="muted" className="block mt-0.5">SMK Kimia PGRI Serang</Text>
          </div>

          {/* ── Tab Toggle ── */}
          <div className="relative flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-6 backdrop-blur-sm">
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-[#ea580c] shadow-lg shadow-[#ea580c]/25"
              animate={{ left: activeTab === "login" ? "4px" : "calc(50%)" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
            {[
              { key: "login",    label: "Masuk"  },
              { key: "register", label: "Daftar" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative z-10 flex-1 py-2 rounded-xl transition-colors duration-200 cursor-pointer ${
                  activeTab === key ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Text variant="caption" color="inherit" className={`font-semibold ${activeTab === key ? "text-white" : "text-slate-500"}`}>
                  {label}
                </Text>
              </button>
            ))}
          </div>

          {/* ── Glassmorphism Card ── */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <LoginForm onSwitch={switchToRegister} />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <RegisterForm onSwitch={switchToLogin} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom tagline */}
          <Text variant="badge" color="muted" className="block text-center text-slate-600 mt-6">
            Lestari Alamku · Jaya Sekolahku
          </Text>
        </motion.div>
      </div>
    </div>
  );
}
