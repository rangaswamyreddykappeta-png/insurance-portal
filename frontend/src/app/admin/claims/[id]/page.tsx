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
import { getToken } from "@/lib/auth";
import { Claim } from "@/lib/types";
import { CheckCircle2, XCircle, StickyNote, UserCog } from "lucide-react";

export default function ClaimDetailPage() {
  const params = useParams();
  const claimId = params.id as string;

  const [claim, setClaim] = useState<Claim | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [adjuster, setAdjuster] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = getToken();

  async function loadClaim() {
    try {
      setLoading(true);

      const data = await apiFetch<Claim[]>("/claims", {}, token || undefined);
      const found = data.find((c) => c.id === claimId) || null;
      setClaim(found);

      const timelineData = await apiFetch<any[]>(
        `/claims/${claimId}/activity-timeline`,
        {},
        token || undefined
      );
      setTimeline(timelineData);
    } catch (err: any) {
      const message = err.message || "Failed to load claim";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClaim();
  }, []);

  async function addNote() {
    try {
      await apiFetch(
        `/claims/${claimId}/review-note`,
        {
          method: "POST",
          body: JSON.stringify({ note }),
        },
        token || undefined
      );
      setNote("");
      toast.success("Review note added");
      loadClaim();
    } catch (err: any) {
      toast.error(err.message || "Failed to add note");
    }
  }

  async function assignAdjuster() {
    try {
      await apiFetch(
        `/claims/${claimId}/assign-adjuster`,
        {
          method: "POST",
          body: JSON.stringify({ adjusterName: adjuster }),
        },
        token || undefined
      );
      setAdjuster("");
      toast.success("Adjuster assigned");
      loadClaim();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign adjuster");
    }
  }

  async function approveClaim() {
    try {
      await apiFetch(
        `/claims/${claimId}/approve`,
        {
          method: "POST",
          body: JSON.stringify({ note: "Approved by admin" }),
        },
        token || undefined
      );
      toast.success("Claim approved");
      loadClaim();
    } catch (err: any) {
      toast.error(err.message || "Failed to approve claim");
    }
  }

  async function rejectClaim() {
    try {
      await apiFetch(
        `/claims/${claimId}/reject`,
        {
          method: "POST",
          body: JSON.stringify({ note: "Rejected by admin" }),
        },
        token || undefined
      );
      toast.success("Claim rejected");
      loadClaim();
    } catch (err: any) {
      toast.error(err.message || "Failed to reject claim");
    }
  }

  return (
    <ProtectedRoute allowedRole="admin">
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
              className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white p-8 shadow-2xl"
            >
              <div className="flex justify-between items-start gap-6">
                <div>
                  <p className="text-blue-200 font-medium mb-2">Claim Detail</p>
                  <h1 className="text-4xl font-bold">{claim.title}</h1>
                  <p className="text-slate-300 mt-2">{claim.claimNumber}</p>
                  <p className="text-slate-200 mt-4 max-w-3xl">{claim.description}</p>
                </div>
                <StatusBadge status={claim.status} />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold mb-4">Activity Timeline</h2>
                  <div className="space-y-5 border-l-2 border-blue-100 ml-2">
                    {timeline.length === 0 ? (
                      <p className="text-gray-500 ml-6">No activity yet.</p>
                    ) : (
                      timeline.map((item) => (
                        <TimelineItem
                          key={item.id}
                          title={item.type}
                          description={item.description}
                          timestamp={item.createdAt}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold mb-4">Documents</h2>
                  <div className="space-y-3">
                    {claim.documents?.length ? (
                      claim.documents.map((doc: any) => (
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
                      <p className="text-gray-500">No documents found.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4">Add Review Note</h2>
                  <textarea
                    className="w-full border rounded-2xl px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write internal review notes..."
                  />
                  <button
                    onClick={addNote}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white py-3 hover:bg-blue-700 transition"
                  >
                    <StickyNote size={18} />
                    Add Note
                  </button>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4">Assign Adjuster</h2>
                  <input
                    className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={adjuster}
                    onChange={(e) => setAdjuster(e.target.value)}
                    placeholder="Enter adjuster name"
                  />
                  <button
                    onClick={assignAdjuster}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 text-white py-3 hover:bg-purple-700 transition"
                  >
                    <UserCog size={18} />
                    Assign Adjuster
                  </button>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4">Decision Actions</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={approveClaim}
                      className="rounded-2xl bg-green-600 text-white py-3 hover:bg-green-700 transition"
                    >
                      Approve Claim
                    </button>
                    <button
                      onClick={rejectClaim}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 text-white py-3 hover:bg-red-700 transition"
                    >
                      <XCircle size={18} />
                      Reject Claim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageShell>
    </ProtectedRoute>
  );
}