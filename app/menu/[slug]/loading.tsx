export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50 max-w-md mx-auto shadow-sm animate-pulse space-y-4 pb-12">
      {/* Cover Skeleton */}
      <div className="h-44 w-full bg-stone-200" />
      
      {/* Logo & Info Skeleton */}
      <div className="px-4 space-y-3">
        <div className="h-16 w-16 rounded-2xl bg-stone-300 -mt-10 border-4 border-stone-50" />
        <div className="h-6 w-3/4 bg-stone-200 rounded-md" />
        <div className="h-4 w-full bg-stone-200 rounded-md" />
        <div className="h-10 w-full bg-stone-200 rounded-xl" />
      </div>

      {/* Nav Skeleton */}
      <div className="h-12 w-full bg-stone-200" />

      {/* Food Cards Skeleton */}
      <div className="px-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 w-full bg-stone-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
