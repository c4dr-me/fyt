import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { CalendarDays, Clock, Users, TrendingUp } from "lucide-react";

interface CalendarWidgetProps {
  attendanceLogs: any[];
}

export function CalendarWidget({ attendanceLogs }: CalendarWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5" />
            <span>Calendar & Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-8 bg-muted rounded"></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="h-16 bg-muted rounded"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedDateString = selectedDate?.toDateString();
  const selectedDateLogs = attendanceLogs.filter(log => 
    new Date(log.timestamp).toDateString() === selectedDateString
  );

  const today = new Date().toDateString();
  const todayLogs = attendanceLogs.filter(log => 
    new Date(log.timestamp).toDateString() === today
  );

  const todayCheckIns = todayLogs.filter(log => log.type === 'in').length;
  const todayCheckOuts = todayLogs.filter(log => log.type === 'out').length;

  const safeCheckedInToday = isNaN(todayCheckIns) ? 0 : todayCheckIns;
  const safeCheckedOutToday = isNaN(todayCheckOuts) ? 0 : todayCheckOuts;

  // activity for highligh
  const daysWithActivity = attendanceLogs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toDateString();
    if (!acc[date]) acc[date] = { checkIns: 0, checkOuts: 0 };
    if (log.type === 'in') acc[date].checkIns++;
    else acc[date].checkOuts++;
    return acc;
  }, {} as Record<string, { checkIns: number; checkOuts: number }>);

  return (
    <TooltipProvider>
      <Card className="col-span-3 h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5" />
            <span>Calendar & Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="p-4 flex-1 flex items-center justify-center">
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0 mx-auto"
              disabled={(date) => date > new Date()} 
              modifiers={{
                hasActivity: (date) => {
                  const dateString = date.toDateString();
                  return !!daysWithActivity[dateString];
                }
              }}
              modifiersStyles={{
                hasActivity: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold'
                }
              }}
            />
          </div>
          
          {selectedDate && (
            <div className="px-4 pb-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </h4>
                {selectedDateLogs.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-background rounded">
                      <div className="text-lg font-bold text-green-600">
                        {String(selectedDateLogs.filter(log => log.type === 'in').length || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Punch Ins</div>
                    </div>
                    <div className="text-center p-2 bg-background rounded">
                      <div className="text-lg font-bold text-blue-600">
                        {String(selectedDateLogs.filter(log => log.type === 'out').length || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Punch Outs</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-background rounded">
                    <div className="text-muted-foreground text-sm">
                      No attendance data for this day
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="px-4 pb-4 border-t bg-muted/30">
            <div className="pt-4">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Today's Overview</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors cursor-pointer">
                      <div className="text-2xl font-bold text-green-600">{String(safeCheckedInToday)}</div>
                      <div className="text-sm text-muted-foreground">Punch Ins</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total check-ins today</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors cursor-pointer">
                      <div className="text-2xl font-bold text-blue-600">{String(safeCheckedOutToday)}</div>
                      <div className="text-sm text-muted-foreground">Punch Outs</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total check-outs today</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {todayLogs.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2 flex items-center space-x-2">
                    <Users className="h-3 w-3" />
                    <span>Recent Activity</span>
                  </h5>
                  <div className="space-y-2">
                    {todayLogs.slice(0, 3).map((log, index) => (
                      <div key={index} className="flex items-center justify-between text-xs p-2 bg-background rounded">
                        <span className="font-medium">{log.employeeName || 'Unknown'}</span>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={log.type === 'in' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {log.type === 'in' ? 'In' : 'Out'}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {todayLogs.length > 3 && (
                      <div className="text-center text-xs text-muted-foreground">
                        +{todayLogs.length - 3} more activities
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
