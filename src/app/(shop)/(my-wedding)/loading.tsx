export default function Loading() {
  return (
    <div className="container py-20">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Animated spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
        <p className="text-sm text-text/60">Loading your wedding details...</p>
      </div>
    </div>
  )
}

