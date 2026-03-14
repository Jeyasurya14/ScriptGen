import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-80px)]">
      {/* Left Panel Skeleton */}
      <Card className="lg:col-span-5 flex flex-col h-fit">
        <CardHeader className="pb-4">
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardBody className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </CardBody>
        <CardFooter>
          <Skeleton className="h-16 w-full rounded-2xl" />
        </CardFooter>
      </Card>

      {/* Right Panel Skeleton */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-xl" />
          ))}
        </div>
        <Card className="min-h-[420px]">
          <CardBody className="p-6 space-y-4">
            <SkeletonText lines={1} className="w-1/3 mb-6" />
            <SkeletonText lines={4} />
            <SkeletonText lines={3} className="w-5/6" />
            <SkeletonText lines={5} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
