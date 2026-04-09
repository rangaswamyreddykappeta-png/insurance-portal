"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
        }),
      });

      toast.success("Signup successful. Please login.");
      router.push("/login");
    } catch (err: any) {
      const message = err.message || "Signup failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute bottom-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-indigo-400/20 blur-3xl" />

      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        onSubmit={handleSignup}
        className="relative w-full max-w-lg rounded-3xl border border-white/40 bg-white/75 backdrop-blur-2xl shadow-2xl p-8"
      >
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white text-xl font-bold mb-4">
            IP
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="text-gray-600 mt-2">
            Sign up to access the insurance claims platform
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-slate-800">Full Name</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Enter your full name"
          />
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
            placeholder="Choose a password"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-slate-800">Role</label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value as "customer" | "admin")}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </motion.form>
    </main>
  );
}