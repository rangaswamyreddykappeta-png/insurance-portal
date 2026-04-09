"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default function AppNavbar() {
  const user = getUser();

  return (
    <motion.div
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50 border-b border-white/40 bg-white/75 backdrop-blur-2xl shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg">
            IP
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">Insurance Portal</p>
            <p className="text-xs text-slate-500">Claims management platform</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user?.role === "customer" && (
            <>
              <Link
                href="/customer"
                className="text-slate-700 hover:text-blue-600 transition font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/customer/submit-claim"
                className="text-slate-700 hover:text-blue-600 transition font-medium"
              >
                Submit Claim
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-slate-700 hover:text-blue-600 transition font-medium"
            >
              Admin Dashboard
            </Link>
          )}

          {user?.fullName && (
            <div className="hidden md:block rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {user.fullName}
            </div>
          )}

          {user ? <LogoutButton /> : <Link href="/login">Login</Link>}
        </div>
      </div>
    </motion.div>
  );
}