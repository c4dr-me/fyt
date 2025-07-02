"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../lib/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const getNavItems = () => {
    const role = user?.role || "";
    return [
      {
        label: "Dashboard",
        href: `/dashboard?role=${role}`,
        icon: LayoutDashboard,
      },
      {
        label: "Employees",
        href: `/dashboard/employees?role=${role}`,
        icon: Users,
      },
      {
        label: "Tasks",
        href: `/dashboard/task?role=${role}`,
        icon: CheckSquare,
      },
      {
        label: "Attendance",
        href: `/dashboard/attendance?role=${role}`,
        icon: Clock,
      },
    ];
  };

  const formatRoleDisplay = (role: string | undefined | null): string => {
    if (!role) return "N/A";
    if (role === "superadmin") return "Super Admin";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const UserAvatar = ({ size = "h-10 w-10", textSize = "" }: { size?: string; textSize?: string }) => (
    <Avatar className={size}>
      <AvatarFallback className={textSize}>
        {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
      </AvatarFallback>
    </Avatar>
  );

  const RoleBadge = ({ className = "text-xs" }: { className?: string }) => (
    <Badge className={`${className} ${getRoleBadgeClass(user?.role || "")}`}>
      {formatRoleDisplay(user?.role)}
    </Badge>
  );

  const UserProfileDropdownContent = () => (
    <DropdownMenuContent align="start" className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium">{user?.name}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
          <RoleBadge className="text-xs w-fit" />
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm border-0 font-medium px-2 py-1 rounded-md";
      case "admin":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm border-0 font-medium px-2 py-1 rounded-md";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm border-0 font-medium px-2 py-1 rounded-md";
    }
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} mb-8 flex-shrink-0 pt-6`}
      >
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-xl">Parlour Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-hidden">
        {getNavItems().map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center ${collapsed ? "justify-center px-2" : "px-4"} py-2 rounded-lg transition-colors ${
              pathname.split("?")[0] === item.href.split("?")[0]
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100"
            }`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

       
      <div className="mt-4 space-y-3 flex-shrink-0 border-t pt-4 relative">
      
        <div className="hidden lg:block">
            <Button
            variant="secondary"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`absolute ${collapsed ? "right-[-16px]" : "right-[-16px]"} top-[-19px] w-8 h-8 mr-1 bg-white border border-gray-300 shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-full z-50 size-8`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight />
            ) : (
              <ChevronLeft />
            )}
          </Button>

        </div>

        {collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <UserAvatar size="h-8 w-8" textSize="text-xs" />
              </div>
            </DropdownMenuTrigger>
            <UserProfileDropdownContent />
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <UserAvatar />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <RoleBadge className="mt-1" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <UserProfileDropdownContent />
          </DropdownMenu>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside
        className={`hidden lg:flex ${sidebarCollapsed ? "w-20" : "w-64"} bg-white border-r transition-all duration-300 ease-in-out flex-shrink-0 overflow-visible`}
      >
        <div className="flex flex-col w-full px-4 pl-4 pr-1 h-full relative">
          <SidebarContent collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-8 flex-shrink-0 pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="font-bold text-xl">Parlour Admin</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 space-y-2 overflow-hidden">
            {getNavItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  pathname.split("?")[0] === item.href.split("?")[0]
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-4 space-y-3 flex-shrink-0 border-t pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                  <UserAvatar />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <RoleBadge className="mt-1" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <UserProfileDropdownContent />
            </DropdownMenu>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="lg:hidden bg-white border-b px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <UserAvatar size="h-8 w-8" textSize="text-xs" />
              <RoleBadge />
            </div>
            <div className="w-8" />  
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
