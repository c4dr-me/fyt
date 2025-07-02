"use client";
import { useEmployees } from "../../lib/hooks/useEmployees";
import { useAttendance } from "../../lib/hooks/useAttendance";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AttendanceGridSkeleton, DashboardStatsSkeleton } from "@/components/skeletons";
import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Clock, LogIn, LogOut, Users, CheckCircle, Circle, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const socket = io(process.env.NEXT_PUBLIC_API_WS_URL || "http://localhost:5000");

export default function AttendancePunchPage() {
  const { employees, loading: loadingEmployees, fetchEmployees } = useEmployees(true);
  const { logs, fetchLogs } = useAttendance(true); 
  const [punching, setPunching] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const getLastPunchType = (employeeId: string) => {
    const recentLogs = logs
      .filter((l) => l.employeeId === employeeId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return recentLogs.length === 0 ? "out" : recentLogs[0].type;
  };

  const getLastPunchTime = (employeeId: string) => {
    const recentLogs = logs
      .filter((l) => l.employeeId === employeeId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (recentLogs.length === 0) return null;
    return new Date(recentLogs[0].timestamp).toLocaleTimeString();
  };

  const getCardClasses = (isIn: boolean) => {
    return `transition-all duration-300 hover:shadow-lg border-2 ${
      isIn 
        ? 'ring-2 ring-teal-200 bg-teal-50 border-teal-300' 
        : 'ring-1 ring-gray-200 bg-white border-gray-200'
    }`;
  };

  const getStatusClasses = (isIn: boolean) => {
    return `flex items-center justify-center py-2 px-3 rounded-lg mb-4 ${
      isIn 
        ? 'bg-teal-100 text-teal-800 border border-teal-200' 
        : 'bg-gray-100 text-gray-600 border border-gray-200'
    }`;
  };

  const getGridClasses = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-lg';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-4xl';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl';
  };

  const getButtonClasses = (isIn: boolean, isPunching: boolean) => {
    const baseClasses = `w-full transition-all duration-200 ${
      isPunching ? 'opacity-70' : 'hover:scale-105'
    }`;
    const variantClasses = !isIn ? 'bg-teal-600 hover:bg-teal-700' : '';
    return `${baseClasses} ${variantClasses}`;
  };

  const stats = useMemo(() => {
    const checkedIn = filteredEmployees.filter(emp => getLastPunchType(emp._id) === "in").length;
    const checkedOut = filteredEmployees.filter(emp => getLastPunchType(emp._id) === "out").length;
    const total = filteredEmployees.length;
    return { checkedIn, checkedOut, total };
  }, [filteredEmployees, logs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchEmployees();
    fetchLogs();
  }, []);

  useEffect(() => {
    socket.on("attendance:update", (newLog) => {
      fetchLogs(); 
      toast.success(`${newLog.employeeName} punched ${newLog.type === "in" ? "in" : "out"}!`);
    });

    return () => {
      socket.off("attendance:update");
    };
  }, [fetchLogs]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePunch = async (employeeId: string, employeeName: string) => {
    setPunching(employeeId);
    setError("");
    
    const lastType = getLastPunchType(employeeId);
    const type = lastType === "in" ? "out" : "in";
    
    console.log(`Attempting to punch ${type} for ${employeeName} (last type: ${lastType})`);
    
    try {
      await new Promise((resolve, reject) => {
        socket.emit("attendance:punch", { employeeId, employeeName, type }, (res: any) => {
          console.log("Socket response:", res);
          if (res?.error) {
            reject(new Error(res.error));
          } else {
            resolve(res);
          }
        });
      });
      
      // Force refresh logs to update UI immediately
      await fetchLogs();
      
      // Small delay to ensure the data is updated, then refresh again
      setTimeout(async () => {
        await fetchLogs();
      }, 500);
      
    } catch (err: any) {
      console.error("Punch error:", err);
      const errorMessage = err.message || "Failed to punch";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPunching(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 font-mono">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-teal-900">Employee Attendance</h1>
          </div>
          <p className="text-teal-700 max-w-md mx-auto">
            Quick and easy punch in/out system for all employees
          </p>
        </div>

        {loadingEmployees ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="text-sm font-medium text-teal-700">Punched In</span>
                </div>
                <div className="text-2xl font-bold text-teal-800">
                  {stats.checkedIn}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Circle className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-orange-700">Punched Out</span>
                </div>
                <div className="text-2xl font-bold text-orange-800">
                  {stats.checkedOut}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cyan-50 border-cyan-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-cyan-600 mr-2" />
                  <span className="text-sm font-medium text-cyan-700">Total Employees</span>
                </div>
                <div className="text-2xl font-bold text-cyan-800">{stats.total}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {!loadingEmployees && (
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-600" />
              <Input
                type="text"
                placeholder="Search employees by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500 font-mono"
              />
            </div>
            {searchTerm && (
              <div className="text-center mt-2 text-sm text-teal-600">
                Found {stats.total} employee{stats.total !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-center font-mono">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {!loadingEmployees && stats.total > itemsPerPage && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-teal-600">
                Showing {startIndex + 1}-{Math.min(endIndex, stats.total)} of {stats.total} employees
              </p>
              <div className="text-sm text-teal-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <div className={`grid gap-6 w-full ${getGridClasses(currentEmployees.length)}`}>
              {loadingEmployees ? (
                <div className="col-span-full">
                  <AttendanceGridSkeleton />
                </div>
              ) : stats.total === 0 ? (
                <div className="col-span-full text-center py-12">
                  {searchTerm ? (
                    <>
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No employees found matching "{searchTerm}".</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchTerm("")}
                        className="mt-4 border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        Clear search
                      </Button>
                    </>
                  ) : (
                    <>
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No employees found.</p>
                    </>
                  )}
                </div>
              ) : (
                currentEmployees.map((emp) => {
                  const lastType = getLastPunchType(emp._id);
                  const isIn = lastType === "in";
                  const lastTime = getLastPunchTime(emp._id);
                  const isPunching = punching === emp._id;

                  return (
                    <Card 
                      key={emp._id} 
                      className={getCardClasses(isIn)}
                    >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 border-2 border-teal-200">
                          <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                            {emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-teal-900 truncate">{emp.name}</h3>
                          <p className="text-sm text-teal-600 break-words font-mono">{emp.email}</p>
                          <Badge 
                            variant={emp.role === 'admin' ? 'default' : 'secondary'}
                            className={`text-xs mt-1 ${
                              emp.role === 'admin' 
                                ? 'bg-teal-600 hover:bg-teal-700' 
                                : 'bg-teal-100 text-teal-700'
                            }`}
                          >
                            {emp.role}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Status Indicator */}
                      <div className={getStatusClasses(isIn)}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          isIn ? 'bg-teal-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm font-medium">
                          {isIn ? 'Punched In' : 'Punched Out'}
                        </span>
                      </div>

                      {lastTime && (
                        <div className="text-center mb-4 p-2 bg-teal-25 rounded">
                          <p className="text-xs text-teal-600">Last punch at</p>
                          <p className="text-sm font-medium text-teal-700 font-mono">{lastTime}</p>
                        </div>
                      )}

                      <Button
                        onClick={() => handlePunch(emp._id, emp.name)}
                        disabled={isPunching}
                        variant={isIn ? "destructive" : "default"}
                        size="lg"
                        className={`h-12 font-mono ${getButtonClasses(isIn, isPunching)}`}
                      >
                        <div className="flex items-center justify-center min-w-[120px]">
                          {isPunching ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              {isIn ? (
                                <LogOut className="h-4 w-4 mr-2" />
                              ) : (
                                <LogIn className="h-4 w-4 mr-2" />
                              )}
                              <span>{isIn ? "Punch Out" : "Punch In"}</span>
                            </>
                          )}
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                  );
                })
              )}
            </div>
          </div>
          {!loadingEmployees && totalPages > 1 && (
            <div className="flex justify-center pt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer border-teal-300 text-teal-700 hover:bg-teal-50"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNumber: number;
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
        </div>
      </div>
    </div>
  );
} 