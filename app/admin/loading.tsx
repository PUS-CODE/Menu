export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-stone-100 animate-pulse">
      {/* Admin Nav Skeleton */}
      <div className="h-16 w-full bg-stone-900" />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="h-12 w-full bg-stone-200 rounded-xl" />
        <div className="h-96 w-full bg-white rounded-2xl border border-stone-200" />
      </div>
    </div>
  );
}
