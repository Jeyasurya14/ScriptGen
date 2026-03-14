import { Skeleton, SkeletonText, SkeletonCircle } from "@/components/ui/Skeleton";
import { Card, CardBody } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10 min-h-screen">
      <div>
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardBody className="p-5 flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-40" />
        <Card>
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/6" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
