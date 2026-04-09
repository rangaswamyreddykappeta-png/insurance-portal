"use client";

import { FileText, Download } from "lucide-react";

type DocumentCardProps = {
  fileName: string;
  onDownload: () => void;
};

export default function DocumentCard({
  fileName,
  onDownload,
}: DocumentCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 hover:bg-white hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <FileText size={20} />
        </div>
        <div>
          <p className="font-medium text-slate-900">{fileName}</p>
          <p className="text-sm text-gray-500">Secure uploaded document</p>
        </div>
      </div>

      <button
        onClick={onDownload}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
      >
        <Download size={16} />
        Download
      </button>
    </div>
  );
}