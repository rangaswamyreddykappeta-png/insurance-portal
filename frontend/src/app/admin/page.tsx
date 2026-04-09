"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppNavbar from "@/components/layout/AppNavbar";
import PageShell from "@/components/layout/PageShell";
import StatusBadge from "@/components/ui/StatusBadge";
import DashboardStatCard from "@/components/ui/DashboardStatCard";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Claim } from "@/lib/types";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function AdminDashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClaims() {
      try {
        const token = getToken();
        const data = await apiFetch<Claim[]>("/claims", {}, token || undefined);
        setClaims(data);
      } catch (err: any) {
        const message = err.message || "Failed to load claims";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    loadClaims();
  }, []);

  const stats = useMemo(() => {
    const total = claims.length;
    const submitted = claims.filter((c) => c.status === "submitted").length;
    const approved = claims.filter((c) => c.status === "approved").length;
    const rejected = claims.filter((c) => c.status === "rejected").length;

    return { total, submitted, approved, rejected };
  }, [claims]);

  return (
    <ProtectedRoute allowedRole="admin">
      <AppNavbar />
      <PageShell>
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white p-8 shadow-2xl"
          >
            <p className="text-blue-200 font-medium mb-3">Admin Control Center</p>
            <h1 className="text-4xl font-bold">Manage Insurance Claims</h1>
            <p className="text-slate-300 mt-3 max-w-2xl">
              Review submissions, assign adjusters, approve or reject claims,
              and monitor the full workflow in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <DashboardStatCard
              title="Total Claims"
              value={stats.total}
              subtitle="All claims in the system"
              accent="slate"
            />
            <DashboardStatCard
              title="Submitted"
              value={stats.submitted}
              subtitle="Pending admin action"
              accent="yellow"
            />
            <DashboardStatCard
              title="Approved"
              value={stats.approved}
              subtitle="Successfully processed"
              accent="green"
            />
            <DashboardStatCard
              title="Rejected"
              value={stats.rejected}
              subtitle="Needs follow-up or resubmission"
              accent="red"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Claim Queue</h2>
              <p className="text-gray-600 mt-1">
                Open a claim to review documents, add notes, or update status
              </p>
            </div>

            {loading && (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3 py-3 text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {claims.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    No claims available yet.
                  </div>
                ) : (
                  claims.map((claim, index) => (
                    <motion.div
                      key={claim.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                    >
                      <Link
                        href={`/admin/claims/${claim.id}`}
                        className="block rounded-3xl border border-gray-200 p-5 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl hover:border-blue-200 transition"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-xl text-slate-900">
                              {claim.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {claim.claimNumber}
                            </p>
                            <p className="mt-3 text-gray-700">
                              {claim.description}
                            </p>
                          </div>
                          <StatusBadge status={claim.status} />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}