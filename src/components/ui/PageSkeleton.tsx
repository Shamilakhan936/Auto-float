export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-secondary animate-pulse rounded" />
          <div className="h-4 w-64 bg-secondary animate-pulse rounded" />
        </div>
        <div className="h-10 w-32 bg-secondary animate-pulse rounded" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-48 bg-card animate-pulse rounded-xl" />
        <div className="h-48 bg-card animate-pulse rounded-xl" />
        <div className="h-48 bg-card animate-pulse rounded-xl" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-card animate-pulse rounded-xl" />
        <div className="h-96 bg-card animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-card animate-pulse rounded-xl ${className}`}>
      <div className="p-6 space-y-4">
        <div className="h-6 w-32 bg-secondary rounded" />
        <div className="h-4 w-48 bg-secondary rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-secondary rounded" />
          <div className="h-4 w-3/4 bg-secondary rounded" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="h-12 bg-secondary animate-pulse rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-card animate-pulse rounded" />
      ))}
    </div>
  );
}

