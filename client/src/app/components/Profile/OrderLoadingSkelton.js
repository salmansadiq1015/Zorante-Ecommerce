import { Skeleton } from "@/components/ui/skeleton";

export default function OrderCardSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 p-4 border rounded-lg animate-pulse"
        >
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>

          {/* Product list skeleton (optional) */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, j) => (
              <div
                key={j}
                className="p-2 rounded-md bg-gray-100 flex items-center gap-3"
              >
                <Skeleton className="h-[70px] w-[80px] rounded-md" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
