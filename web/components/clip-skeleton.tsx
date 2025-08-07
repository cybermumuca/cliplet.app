import { Skeleton } from "@/components/ui/skeleton";

interface ClipSkeletonProps {
  isMobile?: boolean;
}

export function ClipSkeleton({ isMobile = false }: ClipSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Content skeleton */}
      <div className="space-y-4">
        <Skeleton className={`${isMobile ? "h-64" : "h-52"} w-full rounded-lg`} />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>

      {/* Metadata skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ClipButtonsSkeleton() {
  return (
    <>
      <Skeleton className="h-9.5 w-full" />
      <Skeleton className="h-9.5 w-full" />
    </>
  );
}

export function ClipHeaderSkeleton({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${isMobile ? "items-center justify-center" : ""
        }`}
    >
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
