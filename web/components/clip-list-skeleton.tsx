import { Skeleton } from "@/components/ui/skeleton";

export function ClipListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div className="space-y-3 p-4 rounded-lg border bg-card" key={index}>
          {/* Content area skeleton */}
          <Skeleton className="h-full w-full rounded-md aspect-square relative" />
        </div>
      ))}
    </div>
  );
}


