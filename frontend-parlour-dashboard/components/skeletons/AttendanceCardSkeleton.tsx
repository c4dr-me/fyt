import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AttendanceCardSkeleton() {
  return (
    <Card className="transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[100px]" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Skeleton className="h-8 w-full rounded-lg mb-4" />

        <div className="text-center mb-4 space-y-1">
          <Skeleton className="h-3 w-20 mx-auto" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>

        <Skeleton className="h-12 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

export function AttendanceGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex justify-center mt-2">
      <div className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl">
        {Array.from({ length: count }).map((_, i) => (
          <AttendanceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
