"use client";
import { useDashboardProtection } from "../../../lib/hooks/useAuth";
import { useAttendance } from "../../../lib/hooks/useAttendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Users, Activity } from "lucide-react";

export default function AttendanceDashboardPage() {
  useDashboardProtection(["superadmin", "admin"]);
  const { logs, loading, fetchLogs } = useAttendance();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [logsPerPage] = useState(20); 
  const [logPageStates, setLogPageStates] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const groupLogsByDate = () => {
    const grouped: { [key: string]: typeof logs } = {};
    logs.forEach(log => {
      const date = formatDate(log.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });
    return grouped;
  };

  const groupedLogs = groupLogsByDate();
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  

  const totalPages = Math.ceil(sortedDates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDates = sortedDates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLogPageChange = (date: string, page: number) => {
    setLogPageStates(prev => ({ ...prev, [date]: page }));
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Attendance Dashboard</h1>
          <p className="text-teal-600">Monitor employee attendance and real-time updates</p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/attendance">
            <Clock className="h-4 w-4 mr-2" />
            Go to Punch Page
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading attendance data...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-teal-200 bg-teal-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-teal-700">Total Records</CardTitle>
                <Activity className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-800">{logs.length}</div>
                <p className="text-xs text-teal-600">All time attendance logs</p>
              </CardContent>
            </Card>
            
            <Card className="border-teal-200 bg-teal-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-teal-700">Today's Activity</CardTitle>
                <Clock className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-800">
                  {logs.filter(log => {
                    const today = new Date();
                    const logDate = new Date(log.timestamp);
                    return today.getFullYear() === logDate.getFullYear() &&
                           today.getMonth() === logDate.getMonth() &&
                           today.getDate() === logDate.getDate();
                  }).length}
                </div>
                <p className="text-xs text-teal-600">Punch actions today</p>
              </CardContent>
            </Card>

            <Card className="border-teal-200 bg-teal-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-teal-700">Active Employees</CardTitle>
                <Users className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-800">
                  {new Set(logs.map(log => log.employeeId)).size}
                </div>
                <p className="text-xs text-teal-600">Unique employees with records</p>
              </CardContent>
            </Card>
          </div>

          {Object.keys(groupedLogs).length === 0 ? (
            <Card className="border-teal-200">
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                <p className="text-teal-600 mb-4">No attendance records found</p>
                <Button className="bg-teal-600 hover:bg-teal-700" asChild>
                  <Link href="/attendance">Start Tracking Attendance</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-teal-600">
                  Showing page {currentPage} of {totalPages} ({sortedDates.length} total days)
                </p>
                <div className="text-sm text-teal-600">
                  {logsPerPage} items per page
                </div>
              </div>

              {currentDates.map((date) => {
                const dateLogs = groupedLogs[date];
                const currentLogPage = logPageStates[date] || 1;
                const totalLogPages = Math.ceil(dateLogs.length / logsPerPage);
                const startLogIndex = (currentLogPage - 1) * logsPerPage;
                const endLogIndex = startLogIndex + logsPerPage;
                const currentDateLogs = dateLogs
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(startLogIndex, endLogIndex);
                
                return (
                  <Card key={date} className="border-teal-200">
                    <CardHeader className="bg-teal-50">
                      <CardTitle className="flex items-center justify-between text-teal-800">
                        <span className="font-mono">{date}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="border-teal-300 text-teal-700">
                            {String(dateLogs.length || 0)} records
                          </Badge>
                          {totalLogPages > 1 && (
                            <span className="text-xs text-teal-600">
                              Page {currentLogPage} of {totalLogPages}
                            </span>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-teal-100">
                            <TableHead className="text-teal-700">Employee</TableHead>
                            <TableHead className="text-teal-700">Action</TableHead>
                            <TableHead className="text-teal-700">Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentDateLogs.map((log) => (
                            <TableRow key={log._id} className="border-teal-50">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8 border-2 border-teal-200">
                                    <AvatarFallback className="text-xs bg-teal-100 text-teal-700">
                                      {log.employeeName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-teal-800">{log.employeeName}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={log.type === 'in' ? 'default' : 'outline'}
                                  className={log.type === 'in' ? 'bg-teal-600 hover:bg-teal-700' : 'border-teal-300 text-teal-700'}
                                >
                                  {log.type === 'in' ? 'Punch In' : 'Punch Out'}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm text-teal-700">
                                {formatTime(log.timestamp)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      {totalLogPages > 1 && (
                        <div className="flex items-center justify-center p-4 border-t border-teal-100 bg-teal-25">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => handleLogPageChange(date, Math.max(currentLogPage - 1, 1))}
                                  className={currentLogPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer border-teal-300 text-teal-700 hover:bg-teal-50"}
                                />
                              </PaginationItem>
                              
                              <PaginationItem>
                                <span className="text-sm text-teal-600 px-2">
                                  {currentLogPage} of {totalLogPages}
                                </span>
                              </PaginationItem>
                              
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => handleLogPageChange(date, Math.min(currentLogPage + 1, totalLogPages))}
                                  className={currentLogPage === totalLogPages ? "pointer-events-none opacity-50" : "cursor-pointer border-teal-300 text-teal-700 hover:bg-teal-50"}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer border-teal-300 text-teal-700 hover:bg-teal-50"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 7) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 4) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNumber = totalPages - 6 + i;
                        } else {
                          pageNumber = currentPage - 3 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className={currentPage === pageNumber 
                                ? "bg-teal-600 text-white hover:bg-teal-700" 
                                : "cursor-pointer border-teal-300 text-teal-700 hover:bg-teal-50"
                              }
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer border-teal-300 text-teal-700 hover:bg-teal-50"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 