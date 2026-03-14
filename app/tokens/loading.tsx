import { Skeleton, SkeletonText, SkeletonCircle } from "@/components/ui/Skeleton";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10 min-h-screen flex flex-col">
      <div className="text-center space-y-4 max-w-2xl mx-auto w-full">
        <Skeleton className="h-10 w-64 mx-auto" />
        <SkeletonText lines={2} className="mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex flex-col h-[350px]">
            <CardBody className="p-8 text-center flex-1 flex flex-col justify-center items-center space-y-4">
              <SkeletonCircle className="w-16 h-16 mb-2" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-4 w-16" />
              <div className="w-full border-t border-white/5 pt-4 mt-4 flex justify-center">
                <Skeleton className="h-4 w-32" />
              </div>
            </CardBody>
            <CardFooter className="p-6 bg-surface2/30 flex flex-col gap-4">
              <div className="flex justify-center">
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-auto pt-10 flex justify-center">
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
