import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface RecentActivityWidgetProps {
  logs: any[];
  employees: any[];
}

export function RecentActivityWidget({ logs, employees }: RecentActivityWidgetProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee?.name || 'Unknown Employee';
  };

  const getEmployeeEmail = (employeeId: string) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee?.email || '';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (timestamp: string) => {
    const logDate = new Date(timestamp).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  };

  return (
    <Card className="col-span-4 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
        <CardTitle>Recent Activity</CardTitle>
        {logs.length > itemsPerPage && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {currentLogs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground flex items-center justify-center flex-1">
              No recent activity
            </div>
          ) : (
            currentLogs.map((log, index) => {
              const employeeName = getEmployeeName(log.employeeId);
              const employeeEmail = getEmployeeEmail(log.employeeId);
              const initials = employeeName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
              
              return (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{employeeName}</p>
                      <Badge 
                        variant={log.type === 'in' ? 'default' : 'outline'}
                        className={`text-xs ${log.type === 'in' ? 'bg-teal-600 hover:bg-teal-700' : 'border-teal-300 text-teal-700'}`}
                      >
                        {log.type === 'in' ? 'Punched In' : 'Punched Out'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{employeeEmail}</span>
                      <span>•</span>
                      <span>{formatTime(log.timestamp)}</span>
                      {!isToday(log.timestamp) && (
                        <>
                          <span>•</span>
                          <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
