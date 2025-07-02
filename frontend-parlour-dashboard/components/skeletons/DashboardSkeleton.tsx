import { DashboardStatsSkeleton } from "./DashboardStatsSkeleton";
import { RecentActivitySkeleton } from "./RecentActivitySkeleton";
import { OverviewChartSkeleton } from "./OverviewChartSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <DashboardStatsSkeleton />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[160px]" />
              <Skeleton className="h-4 w-[240px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="flex items-end space-x-2 h-[200px]">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                      <div className="flex flex-col items-center space-y-1 flex-1 justify-end">
                        <Skeleton className="w-6 h-16 rounded-t" />
                        <Skeleton className="w-6 h-12 rounded-t" />
                      </div>
                      <div className="text-center space-y-1">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-3 w-6" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="text-center space-y-1">
                      <Skeleton className="h-6 w-8 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[140px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded" />
                  ))}
                </div>
              </div>
              <div className="p-6 border-t bg-muted/50 space-y-3">
                <Skeleton className="h-5 w-[120px]" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="text-center space-y-1">
                      <Skeleton className="h-8 w-8 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <RecentActivitySkeleton />
        </div>
      </div>
    </div>
  );
}
