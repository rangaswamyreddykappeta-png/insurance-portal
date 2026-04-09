"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";
import { LoginResponse } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("manasa2@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveToken(data.accessToken);
      saveUser(data.user);

      toast.success("Login successful");

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/customer");
      }
    } catch (err: any) {
      const message = err.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-indigo-400/20 blur-3xl" />

      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        onSubmit={handleLogin}
        className="relative w-full max-w-md rounded-3xl border border-white/40 bg-white/75 backdrop-blur-2xl shadow-2xl p-8"
      >
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white text-xl font-bold mb-4">
            IP
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to access your insurance claims portal
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-slate-800">Email</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-slate-800">Password</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-blue-600 text-white py-3 font-medium shadow-lg hover:bg-blue-700 hover:scale-[1.01] transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Create one
          </a>
        </p>
      </motion.form>
    </main>
  );
}