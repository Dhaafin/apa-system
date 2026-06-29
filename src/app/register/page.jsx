"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, class: className }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001f18] px-4 py-12">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[#004d3d]/30 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-[#ea580c]/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl relative z-10">
        {!success ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#ea580c]/20">
                <span className="text-white font-bold text-2xl">🌱</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Join SIPA Adventure</h1>
              <p className="text-sm text-zinc-400 mt-1">Registrasi Akun Anggota Siswa Baru</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your student email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Class (Kelas)"
                placeholder="e.g. XI MIPA 1"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 mt-2 bg-[#004d3d] hover:bg-[#0b5c46]"
                disabled={loading}
              >
                {loading ? "Registering..." : "Create Student Account"}
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-400 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[#ea580c] font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Registrasi Berhasil!</h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              Akun Anda telah dibuat dengan status <strong>PENDING</strong>. Silakan hubungi Guru pembimbing
              untuk menyetujui akun Anda agar bisa masuk ke sistem.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Kembali ke Halaman Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
