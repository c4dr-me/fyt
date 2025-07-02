import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  CheckSquare, 
  Clock,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

interface StatsCardsProps {
  employees: any[];
  tasks: any[];
  attendanceLogs: any[];
}

export function StatsCards({ employees, tasks, attendanceLogs }: StatsCardsProps) {
  // today's attendance
  const today = new Date().toDateString();
  const todaysLogs = attendanceLogs.filter(log => 
    new Date(log.timestamp).toDateString() === today
  );
  
  const checkedInToday = new Set(
    todaysLogs
      .filter(log => log.type === 'in')
      .map(log => log.employeeId)
  ).size;

  // active tasks (non-completed)
  const activeTasks = tasks.filter(task => task.status !== 'completed').length;
  
  // completion rate
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // average daily attendance (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });
  
  const avgDailyAttendance = last7Days.reduce((acc, date) => {
    const dayLogs = attendanceLogs.filter(log => 
      new Date(log.timestamp).toDateString() === date
    );
    const uniqueEmployees = new Set(dayLogs.map(log => log.employeeId)).size;
    return acc + uniqueEmployees;
  }, 0) / 7;

  // safety
  const safeAvgDailyAttendance = isNaN(avgDailyAttendance) ? 0 : avgDailyAttendance;
  const safeTrendValue = safeAvgDailyAttendance > 0 
    ? Math.round(((checkedInToday - safeAvgDailyAttendance) / safeAvgDailyAttendance) * 100) 
    : 0;
  const safeAttendanceRate = employees.length > 0 
    ? Math.round((checkedInToday / employees.length) * 100) 
    : 0;

  const stats: StatCard[] = [
    {
      title: "Total Employees",
      value: employees.length || 0,
      description: "Active team members",
      icon: Users,
      className: "bg-blue-50 border-blue-200"
    },
    {
      title: "Present Today",
      value: checkedInToday || 0,
      description: `${isNaN(safeAttendanceRate) ? 0 : safeAttendanceRate}% attendance rate`,
      icon: UserCheck,
      trend: {
        value: isNaN(safeTrendValue) ? 0 : Math.abs(safeTrendValue),
        isPositive: checkedInToday >= safeAvgDailyAttendance
      },
      className: "bg-green-50 border-green-200"
    },
    {
      title: "Active Tasks",
      value: activeTasks || 0,
      description: `${isNaN(completionRate) ? 0 : completionRate}% completion rate`,
      icon: CheckSquare,
      trend: {
        value: isNaN(completionRate) ? 0 : completionRate,
        isPositive: (completionRate || 0) >= 70
      },
      className: "bg-orange-50 border-orange-200"
    },
    {
      title: "Today's Activity",
      value: todaysLogs.length || 0,
      description: "Check-ins and check-outs",
      icon: Activity,
      className: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className={stat.className}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{String(stat.value || 0)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>{stat.description}</span>
              {stat.trend && (
                <div className={`flex items-center space-x-1 ${
                  stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{String(isNaN(stat.trend.value) ? 0 : Math.abs(stat.trend.value))}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
