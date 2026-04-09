"use client";

import { motion } from "framer-motion";

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  accent?: "blue" | "green" | "yellow" | "red" | "slate";
};

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  accent = "blue",
}: DashboardStatCardProps) {
  const accentClasses = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    yellow: "from-yellow-500 to-orange-500",
    red: "from-red-500 to-rose-600",
    slate: "from-slate-700 to-slate-900",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-3xl bg-gradient-to-br ${accentClasses[accent]} text-white p-6 shadow-xl`}
    >
      <p className="text-sm text-white/80">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
      <p className="text-sm text-white/75 mt-3">{subtitle}</p>
    </motion.div>
  );
}