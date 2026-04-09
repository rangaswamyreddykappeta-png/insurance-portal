"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";

type TimelineItemProps = {
  title: string;
  description: string;
  timestamp: string;
};

export default function TimelineItem({
  title,
  description,
  timestamp,
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative pl-8"
    >
      <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100" />
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 hover:shadow-md transition">
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold text-slate-900 capitalize">{title.replaceAll("_", " ")}</p>
          <div className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Clock3 size={14} />
            {new Date(timestamp).toLocaleString()}
          </div>
        </div>

        <p className="text-gray-700 mt-2">{description}</p>
      </div>
    </motion.div>
  );
}