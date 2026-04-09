"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppNavbar from "@/components/layout/AppNavbar";
import PageShell from "@/components/layout/PageShell";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function SubmitClaimPage() {
  const [policyId, setPolicyId] = useState("1e716253-ee4f-411b-8838-b326b9eef184");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = getToken();

      const createdClaim: any = await apiFetch(
        "/claims",
        {
          method: "POST",
          body: JSON.stringify({ policyId, title, description }),
        },
        token || undefined
      );

      if (file && token) {
        const formData = new FormData();
        formData.append("file", file);

        await fetch(`${API_BASE_URL}/claims/${createdClaim.id}/documents`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
      });
      }

      setMessage("Claim submitted successfully");
      toast.success("Claim submitted successfully");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err: any) {
      const message = err.message || "Failed to submit claim";
      setError(message);
      toast.error(message);
    }
  }

  return (
    <ProtectedRoute allowedRole="customer">
      <AppNavbar />
      <PageShell>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Submit Claim</h1>
            <p className="text-gray-600">Create a new insurance claim request</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Policy ID</label>
              <input
                className="w-full border rounded-xl px-3 py-3"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Title</label>
              <input
                className="w-full border rounded-xl px-3 py-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                className="w-full border rounded-xl px-3 py-3"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Upload Document</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {message && (
              <div className="rounded-xl bg-green-50 border border-green-200 px-3 py-3 text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-3 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Submit Claim
            </button>
          </form>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}