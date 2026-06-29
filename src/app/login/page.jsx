"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

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
        throw new Error(result.message || "Gagal masuk");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001f18] px-4">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[#004d3d]/30 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-[#ea580c]/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#ea580c]/20">
            <span className="text-white font-bold text-2xl">🌲</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SIPA ADVENTURE</h1>
          <p className="text-sm text-zinc-400 mt-1">KAPALA - SMK KIMIA PGRI SERANG</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-sm">
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
            className="w-full py-3.5 mt-2 bg-[#004d3d] hover:bg-[#0b5c46]"
            disabled={loading}
          >
            {loading ? "Masuk..." : "Masuk ke Akun"}
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#ea580c] font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>

        <p className="text-center text-xs text-zinc-500 mt-4">
          Lestari Alamku, Jaya Sekolahku!
        </p>
      </div>
    </div>
  );
}
