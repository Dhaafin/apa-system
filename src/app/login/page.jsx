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
    <div className="min-h-screen flex items-center justify-center bg-[#001f18] px-4 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[#004d3d]/30 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-[#ea580c]/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#ea580c]/20">
            {/* SVG Tree Icon replacing emoji */}
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
                d="M12 2L2 22h20L12 2zM12 5l6.5 13H5.5L12 5zm0 8v5"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">SIPA ADVENTURE</h1>
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
            className="w-full py-3.5 mt-2 bg-[#004d3d] hover:bg-[#0b5c46] cursor-pointer transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Masuk..." : "Masuk ke Akun"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-800/80 pt-6">
          <p className="text-xs text-zinc-400">
            Belum terdaftar sebagai anggota?{" "}
            <Link href="/register" className="text-[#ea580c] font-bold hover:underline ml-1">
              Daftar Siswa Baru
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-zinc-500 font-medium tracking-wide uppercase mt-6">
          Lestari Alamku, Jaya Sekolahku!
        </p>
      </div>
    </div>
  );
}
