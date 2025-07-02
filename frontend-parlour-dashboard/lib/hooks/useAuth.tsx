'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../axios';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  _id: string;
  email: string;
  role: 'superadmin' | 'admin';
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        
        if (res.data.tokenData) {
          console.log("JWT Verification:", {
            userId: res.data.tokenData.userId,
            role: res.data.tokenData.role,
            jwtWorking: res.data.tokenData.jwtWorking
          });
        }
      } catch (err) {
        console.log("Auth check failed:", err);
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user } = res.data; 
      setUser(user);
      setLoading(false);
      
      console.log("Login successful:", {
        user: user.name,
        role: user.role,
        email: user.email
      });
      
      if (user.role === 'superadmin' || user.role === 'admin') {
        router.push(`/dashboard?role=${user.role}`);
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useProtectedRoute = (allowedRoles?: ('superadmin' | 'admin')[]) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading) {
      if (pathname === '/attendance') {
        return;
      }
      
      if (!user) {
        console.log("No user found, redirecting to login");
        router.replace('/login');
        return;
      }
      
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log("User role not allowed, redirecting to dashboard");
        router.replace('/dashboard');
        return;
      }
    }
  }, [user, loading, allowedRoles, pathname, router]);
};

export const useDashboardProtection = (allowedRoles?: ('superadmin' | 'admin')[]) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("Dashboard access denied - no user, redirecting to login");
        router.replace('/login');
        return;
      }
      
      const currentUrl = new URL(window.location.href);
      const urlRole = currentUrl.searchParams.get('role');
      
      if (urlRole && urlRole !== user.role) {
        console.log(`URL role ${urlRole} doesn't match user role ${user.role}, redirecting with correct role`);
        router.replace(`/dashboard?role=${user.role}`);
        return;
      }
      
      if (!urlRole) {
        console.log(`Adding role parameter to URL: ${user.role}`);
        const newUrl = `${pathname}?role=${user.role}`;
        router.replace(newUrl);
        return;
      }
      
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log("Dashboard access denied - insufficient role, redirecting");
        router.replace(`/dashboard?role=${user.role}`);
        return;
      }
      console.log("Dashboard access granted:", {
        user: user.name,
        role: user.role,
        urlRole: urlRole,
        allowedRoles: allowedRoles
      });
    }
  }, [user, loading, allowedRoles, pathname, router]);
};