import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function AppPageSkeleton({
  kind = "default",
}: {
  kind?: "dashboard" | "generator" | "referral" | "tokens" | "default";
}) {
  if (kind === "generator") {
    return (
      <div className="grid min-h-[calc(100vh-60px)] gap-6 p-6 lg:grid-cols-[minmax(340px,38%)_minmax(0,1fr)]">
        <Card>
          <CardBody className="space-y-5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-28 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full" />
              ))}
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-2 w-full" />
            <SkeletonText lines={8} />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (kind === "dashboard") {
    return (
      <div className="space-y-8 p-6 md:p-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-52" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardBody className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-3 w-32" />
              </CardBody>
            </Card>
          ))}
        </div>
        <Card>
          <CardBody className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <SkeletonText lines={6} />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (kind === "referral" || kind === "tokens") {
    return (
      <div className="space-y-8 p-6 md:p-8">
        <Card>
          <CardBody className="space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-10 w-72" />
            <SkeletonText lines={2} />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-32" />
            </div>
          </CardBody>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardBody className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-24" />
                <SkeletonText lines={3} />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardBody>
          <SkeletonText lines={6} />
        </CardBody>
      </Card>
    </div>
  );
}
