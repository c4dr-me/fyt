import { useState, useEffect } from 'react';
import api from '../axios';
import axios from 'axios';

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export function useEmployees(isPublic: boolean = false) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      if (isPublic) {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${baseURL}/employees/public`);
        setEmployees(res.data);
      } else {
        const res = await api.get('/employees');
        setEmployees(res.data);
      }
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch employees:', err);
      setError(err?.response?.data?.message || 'Failed to fetch employees');
    }
    setLoading(false);
  };

  const addEmployee = async (data: Partial<Employee>) => {
    if (isPublic) {
      throw new Error('CRUD operations not allowed for public access');
    }
    const res = await api.post('/employees', data);
    setEmployees((prev) => [...prev, res.data]);
  };

  const updateEmployee = async (_id: string, data: Partial<Employee>) => {
    if (isPublic) {
      throw new Error('CRUD operations not allowed for public access');
    }
    const res = await api.put(`/employees/${_id}`, data);
    setEmployees((prev) => prev.map((emp) => (emp._id === _id ? res.data : emp)));
  };

  const deleteEmployee = async (_id: string) => {
    if (isPublic) {
      throw new Error('CRUD operations not allowed for public access');
    }
    await api.delete(`/employees/${_id}`);
    setEmployees((prev) => prev.filter((emp) => emp._id !== _id));
  };

  useEffect(() => {
    fetchEmployees();
  }, [isPublic]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
} 