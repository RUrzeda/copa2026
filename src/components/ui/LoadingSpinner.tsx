export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-navy-600" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-transparent border-t-gold-500 animate-spin" />
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-navy-600 bg-card-gradient p-4 animate-pulse">
      <div className="h-4 bg-navy-600 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-10 bg-navy-700 rounded" />
        <div className="h-10 bg-navy-700 rounded" />
        <div className="h-10 bg-navy-700 rounded" />
      </div>
    </div>
  )
}
