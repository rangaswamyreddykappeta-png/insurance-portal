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
import { getToken, getUser } from "@/lib/auth";
import { Claim } from "@/lib/types";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function CustomerDashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    async function loadClaims() {
      try {
        const token = getToken();
        const data = await apiFetch<Claim[]>("/claims", {}, token || undefined);
        const filtered = data.filter((claim) => claim.submittedBy?.id === user?.id);
        setClaims(filtered);
      } catch (err: any) {
        const message = err.message || "Failed to load claims";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    loadClaims();
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = claims.length;
    const submitted = claims.filter((c) => c.status === "submitted").length;
    const approved = claims.filter((c) => c.status === "approved").length;
    const rejected = claims.filter((c) => c.status === "rejected").length;

    return { total, submitted, approved, rejected };
  }, [claims]);

  return (
    <ProtectedRoute allowedRole="customer">
      <AppNavbar />
      <PageShell>
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-8 shadow-2xl"
          >
            <p className="text-blue-100 font-medium mb-3">Customer Workspace</p>
            <h1 className="text-4xl font-bold">Track Your Insurance Claims</h1>
            <p className="text-blue-100/90 mt-3 max-w-2xl">
              Submit new claims, upload documents, monitor status updates,
              and review claim history in one dashboard.
            </p>

            <div className="mt-6">
              <Link
                href="/customer/submit-claim"
                className="inline-flex rounded-2xl bg-white text-slate-900 px-5 py-3 font-medium shadow hover:scale-[1.02] transition"
              >
                Submit New Claim
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <DashboardStatCard
              title="Total Claims"
              value={stats.total}
              subtitle="Claims you have submitted"
              accent="slate"
            />
            <DashboardStatCard
              title="Submitted"
              value={stats.submitted}
              subtitle="Waiting for admin review"
              accent="yellow"
            />
            <DashboardStatCard
              title="Approved"
              value={stats.approved}
              subtitle="Claims successfully approved"
              accent="green"
            />
            <DashboardStatCard
              title="Rejected"
              value={stats.rejected}
              subtitle="Claims needing action"
              accent="red"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Your Claims</h2>
              <p className="text-gray-600 mt-1">
                Open any claim to view details, documents, and review history
              </p>
            </div>

            {loading && (
              <div className="space-y-4">
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
                    No claims submitted yet.
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
                        href={`/customer/claims/${claim.id}`}
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
                            <p className="mt-3 text-sm text-gray-500">
                              Created: {new Date(claim.createdAt).toLocaleString()}
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