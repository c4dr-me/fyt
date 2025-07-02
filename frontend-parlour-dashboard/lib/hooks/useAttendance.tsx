import { useState, useEffect } from 'react';
import api from '../axios';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

export interface AttendanceLog {
  _id: string;
  employeeId: string;
  employeeName: string;
  type: 'in' | 'out';
  timestamp: string;
}

let socket: Socket | null = null;

export function useAttendance(isPublic: boolean = false) {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      if (isPublic) {
        const baseURL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${baseURL}/attendance/public`);
        setLogs(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await api.get('/attendance');
        setLogs(Array.isArray(res.data) ? res.data : []);
      }
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch attendance logs:', err);
      setError(err?.response?.data?.message || 'Failed to fetch attendance logs');
      setLogs([]); // Set empty array on error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    
    if (!isPublic) {
      if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_API_WS_URL);
      }
      socket.on('attendance:update', (log: AttendanceLog) => {
        setLogs((prev) => {
          // Check if this exact log already exists to avoid duplicates
          const exists = prev.some(l => l._id === log._id);
          if (exists) return prev;
          
          // Add the new log to the beginning of the array
          return [log, ...prev];
        });
      });
    }

    return () => {
      if (!isPublic) {
        socket?.off('attendance:update');
      }
    };
  }, [isPublic]);

  return { logs, loading, error, fetchLogs };
} 