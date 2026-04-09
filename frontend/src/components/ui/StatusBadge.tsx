type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  let bgClass = "bg-gray-100 text-gray-700 border-gray-200";

  if (status === "submitted") {
    bgClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
  } else if (status === "approved") {
    bgClass = "bg-green-50 text-green-700 border-green-200";
  } else if (status === "rejected") {
    bgClass = "bg-red-50 text-red-700 border-red-200";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${bgClass}`}
    >
      {status}
    </span>
  );
}