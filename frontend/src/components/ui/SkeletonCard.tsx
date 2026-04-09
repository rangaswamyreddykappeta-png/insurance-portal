export default function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}