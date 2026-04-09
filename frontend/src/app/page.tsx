"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-white/70 backdrop-blur border text-sm text-blue-600 font-medium shadow mb-6">
            Smart Insurance Platform
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Manage Insurance Claims
            <span className="block text-blue-600">Like a Pro</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Submit claims, upload documents, track approvals, and manage workflows —
            all in one modern platform.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="px-6 py-3 bg-white border rounded-xl hover:bg-gray-50 transition"
            >
              Login
            </Link>
          </div>
        </motion.div>

        {/* RIGHT SIDE (3D STYLE CARD) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ rotate: 1, y: -6 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-white/70 backdrop-blur-2xl border rounded-3xl shadow-2xl p-6 transform hover:rotate-1 hover:scale-[1.02] transition duration-500">

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow">
                <h3 className="font-semibold">Claims</h3>
                <p className="text-sm mt-2 text-blue-100">
                  Submit & track claims easily
                </p>
              </div>

              <div className="bg-white border p-5 rounded-2xl">
                <h3 className="font-semibold">Documents</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Secure S3 file uploads
                </p>
              </div>

              <div className="bg-white border p-5 rounded-2xl">
                <h3 className="font-semibold">Admin Review</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Assign & approve claims
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white p-5 rounded-2xl shadow">
                <h3 className="font-semibold">Audit Logs</h3>
                <p className="text-sm mt-2 text-slate-300">
                  Full activity tracking
                </p>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}