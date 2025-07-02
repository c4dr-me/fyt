import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewChartSkeleton() {
  const fixedHeights = [120, 80, 160, 140, 90, 170, 150];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-[100px]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="space-y-2">
          <div className="flex items-end space-x-2 h-[200px]">
            {fixedHeights.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <Skeleton 
                  className="w-full mb-2" 
                  style={{ height: `${height}px` }}
                />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
