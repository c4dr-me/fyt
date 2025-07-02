"use client";
import { useAuth, useDashboardProtection } from "../../lib/hooks/useAuth";
import { useEmployees } from "../../lib/hooks/useEmployees";
import { useTasks } from "../../lib/hooks/useTasks";
import { useAttendance } from "../../lib/hooks/useAttendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/skeletons";
import { StatsCards } from "@/components/widgets/StatsCards";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { TaskStatusChart } from "@/components/charts/TaskStatusChart";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { RecentActivityWidget } from "@/components/widgets/RecentActivityWidget";
import Link from "next/link";
import { useEffect } from "react";
import { 
  Users, 
  CheckSquare, 
  Activity,
  ArrowRight,
  Plus
} from "lucide-react";

export default function DashboardPage() {
  useDashboardProtection(["superadmin", "admin"]);
  const { user, loading: authLoading } = useAuth();
  const { employees, loading: employeesLoading, fetchEmployees } = useEmployees();
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks();
  const { logs, loading: attendanceLoading, fetchLogs } = useAttendance();

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
    fetchLogs();
  }, []);

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  const isLoading = employeesLoading || tasksLoading || attendanceLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's what's happening with your team today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild size="sm">
            <Link href="/attendance" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Quick Punch</span>
            </Link>
          </Button>
        </div>
      </div>

      <StatsCards 
        employees={employees} 
        tasks={tasks} 
        attendanceLogs={logs} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
  <div className="min-w-0">
          <AttendanceChart data={logs} />
        </div>
         <div className="min-w-0">
          <CalendarWidget attendanceLogs={logs} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7 min-h-[500px]">
        <div className="lg:col-span-3 h-full">
          <TaskStatusChart tasks={tasks} />
        </div>
        <div className="lg:col-span-4 h-full">
          <RecentActivityWidget logs={logs} employees={employees} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <Link href="/dashboard/employees">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Employees</CardTitle>
                </div>
                <Badge variant="secondary">{String(employees.length || 0)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="group-hover:text-foreground transition-colors">
                Manage your team members and their roles
              </CardDescription>
              <div className="flex items-center mt-4 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span>View all employees</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <Link href="/dashboard/task">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Tasks</CardTitle>
                </div>
                <Badge variant="secondary">{String(tasks.filter(t => t.status !== 'completed').length || 0)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="group-hover:text-foreground transition-colors">
                Create and track employee tasks and projects
              </CardDescription>
              <div className="flex items-center mt-4 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span>Manage tasks</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <Link href="/dashboard/attendance">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Attendance</CardTitle>
                </div>
                <Badge variant="secondary">{String(logs.filter(log => 
                  new Date(log.timestamp).toDateString() === new Date().toDateString()
                ).length || 0)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="group-hover:text-foreground transition-colors">
                Monitor employee attendance and work hours
              </CardDescription>
              <div className="flex items-center mt-4 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span>View attendance</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
