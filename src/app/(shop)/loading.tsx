export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Carousel Skeleton */}
        <div className="mb-8 flex gap-2 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-32 rounded-full bg-zinc-200 animate-pulse" />
          ))}
        </div>

        {/* Vendor Count Skeleton */}
        <div className="mb-6 h-5 w-40 bg-zinc-200 animate-pulse rounded" />

        {/* Vendor Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] rounded-xl bg-zinc-200 animate-pulse" />
              <div className="h-4 bg-zinc-200 animate-pulse rounded w-3/4" />
              <div className="h-3 bg-zinc-200 animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
