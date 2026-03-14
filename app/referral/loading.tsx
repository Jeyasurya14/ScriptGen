import { Skeleton, SkeletonText, SkeletonCircle } from "@/components/ui/Skeleton";
import { Card, CardBody } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10 min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative bg-surface border border-surface2 p-8 md:p-12 rounded-[23px] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="max-w-md space-y-4 w-full">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <SkeletonText lines={2} className="mt-4" />
        </div>
        <div className="w-full md:w-auto bg-surface2 border border-white/5 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-4 w-32 mx-auto" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-full md:w-48 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Steps Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-40 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-surface2 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <SkeletonCircle className="w-12 h-12" />
              <Skeleton className="h-5 w-24" />
              <SkeletonText lines={2} className="w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="space-y-4 pt-4 border-t border-surface2">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <SkeletonCircle className="w-4 h-4" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-16" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
