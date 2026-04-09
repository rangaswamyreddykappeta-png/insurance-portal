"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppNavbar from "@/components/layout/AppNavbar";
import PageShell from "@/components/layout/PageShell";
import StatusBadge from "@/components/ui/StatusBadge";
import TimelineItem from "@/components/ui/TimeLineItem";
import DocumentCard from "@/components/ui/DocumentCard";
import { apiFetch } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";
import { Claim } from "@/lib/types";

export default function CustomerClaimDetailPage() {
  const params = useParams();
  const claimId = params.id as string;

  const [claim, setClaim] = useState<Claim | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const token = getToken();

  useEffect(() => {
    async function loadClaim() {
      try {
        const data = await apiFetch<Claim[]>("/claims", {}, token || undefined);
        const found = data.find(
          (c) => c.id === claimId && c.submittedBy?.id === user?.id
        );

        if (!found) {
          setError("Claim not found");
        } else {
          setClaim(found);
        }
      } catch (err: any) {
        const message = err.message || "Failed to load claim";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    loadClaim();
  }, [claimId, token, user?.id]);

  return (
    <ProtectedRoute allowedRole="customer">
      <AppNavbar />
      <PageShell>
        {loading && <p className="text-gray-500">Loading claim details...</p>}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!loading && claim && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-8 shadow-2xl"
            >
              <div className="flex justify-between items-start gap-6">
                <div>
                  <p className="text-blue-100 font-medium mb-2">Your Claim</p>
                  <h1 className="text-4xl font-bold">{claim.title}</h1>
                  <p className="text-blue-100 mt-2">{claim.claimNumber}</p>
                  <p className="text-blue-50 mt-4 max-w-3xl">{claim.description}</p>
                </div>
                <StatusBadge status={claim.status} />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold mb-4">Review History</h2>
                  <div className="space-y-5 border-l-2 border-blue-100 ml-2">
                    {claim.reviews?.length ? (
                      claim.reviews.map((review) => (
                        <TimelineItem
                          key={review.id}
                          title={review.action}
                          description={
                            review.assignedAdjuster
                              ? `${review.note || ""} (Adjuster: ${review.assignedAdjuster})`
                              : review.note || "No note provided"
                          }
                          timestamp={review.createdAt}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 ml-6">No review activity yet.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold mb-4">Documents</h2>
                  <div className="space-y-3">
                    {claim.documents?.length ? (
                      claim.documents.map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          fileName={doc.fileName}
                          onDownload={async () => {
                            const res = await apiFetch<{ downloadUrl: string }>(
                              `/claims/documents/${doc.id}/download-url`,
                              {},
                              token || undefined
                            );
                            window.open(res.downloadUrl, "_blank");
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500">No documents uploaded.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4">Claim Summary</h2>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Claim Number</span>
                      <span>{claim.claimNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status</span>
                      <span>{claim.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Created</span>
                      <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                    </div>
                    {claim.policy && (
                      <div className="pt-3 border-t">
                        <p className="font-medium mb-2">Policy</p>
                        <p>{claim.policy.policyName}</p>
                        <p className="text-gray-500">{claim.policy.policyNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4">Current Status</h2>
                  <p className="text-gray-600">
                    This claim is currently <strong>{claim.status}</strong>. Any admin
                    review notes and status changes will appear in the review history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageShell>
    </ProtectedRoute>
  );
}