import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";

interface AttendanceChartProps {
  data: any[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-end space-x-2 h-[200px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div className="w-4 h-20 bg-gray-200 rounded mb-2"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    // Convert to IST
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(date.getTime() + istOffset);
    istDate.setDate(istDate.getDate() - (6 - i));
    return istDate.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayLogs = data.filter(log => {
      // Converting to ist
      const logDate = new Date(log.timestamp);
      const istOffset = 5.5 * 60 * 60 * 1000;
      const logIST = new Date(logDate.getTime() + istOffset);
      const logDateString = logIST.toISOString().split('T')[0];
      return logDateString === date;
    });
    
    const checkIns = dayLogs.filter(log => log.type === 'in').length;
    const checkOuts = dayLogs.filter(log => log.type === 'out').length;
    
    return {
      date,
      checkIns,
      checkOuts,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    };
  });


  const chartConfig = {
    checkIns: {
      label: "Punch Ins",
      color: "#14b8a6",
    },
    checkOuts: {
      label: "Punch Outs",
      color: "#06b6d4",
    },
  } satisfies ChartConfig;

  return (
    <Card className="col-span-4 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Attendance Overview</CardTitle>
        <div className="text-sm text-muted-foreground">
          Last 7 days punch-in and punch-out trends
        </div>
      </CardHeader>
      <CardContent className="pl-2 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-center space-x-6 text-sm mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <span>Punch Ins</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span>Punch Outs</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0" style={{ minHeight: '300px' }}>
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                className="w-full"
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="checkIns" 
                  fill="var(--color-checkIns)" 
                  radius={[4, 4, 0, 0]}
                  name="Punch Ins"
                />
                <Bar 
                  dataKey="checkOuts" 
                  fill="var(--color-checkOuts)" 
                  radius={[4, 4, 0, 0]}
                  name="Punch Outs"
                />
              </BarChart>
            </ChartContainer>
          </div>
          
          <div className="mt-4 lg:mt-6 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
              <div className="text-center p-3 lg:p-4 bg-teal-50 rounded-lg min-w-0">
                <div className="text-lg lg:text-2xl font-bold text-teal-600 mb-1 truncate">
                  {String(chartData.reduce((sum, day) => sum + (day.checkIns || 0), 0))}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">Total Punch Ins</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-cyan-50 rounded-lg min-w-0">
                <div className="text-lg lg:text-2xl font-bold text-cyan-600 mb-1 truncate">
                  {String(chartData.reduce((sum, day) => sum + (day.checkOuts || 0), 0))}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">Total Punch Outs</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-teal-50 rounded-lg min-w-0">
                <div className="text-lg lg:text-2xl font-bold text-teal-700 mb-1 truncate">
                  {String(Math.round(chartData.reduce((sum, day) => sum + (day.checkIns || 0), 0) / 7) || 0)}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">Daily Average</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
