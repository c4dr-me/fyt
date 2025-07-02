import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface TaskStatusChartProps {
  tasks: any[];
}

export function TaskStatusChart({ tasks }: TaskStatusChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="col-span-3 h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Task Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="animate-pulse space-y-4 flex-1 flex flex-col">
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-8 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t flex-shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
                  <div className="w-12 h-3 bg-gray-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  const statusCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  const total = tasks.length;
  const colors = {
    pending: '#f59e0b',
    'in-progress': '#3b82f6', 
    completed: '#10b981'
  };

  return (
    <Card className="col-span-3 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Task Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 flex flex-col">
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">{status.replace('-', ' ')}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[status as keyof typeof colors]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t flex-shrink-0">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold" style={{ color: colors[status as keyof typeof colors] }}>
                  {String(count || 0)}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {status.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
