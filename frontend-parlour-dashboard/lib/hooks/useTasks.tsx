import { useState, useEffect } from 'react';
import api from '../axios';

export interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: string; 
  status: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch tasks');
    }
    setLoading(false);
  };

  const addTask = async (data: Partial<Task>) => {
    const res = await api.post('/tasks', data);
    setTasks((prev) => [...prev, res.data]);
  };

  const updateTask = async (_id: string, data: Partial<Task>) => {
    const res = await api.put(`/tasks/${_id}`, data);
    setTasks((prev) => prev.map((task) => (task._id === _id ? res.data : task)));
  };

  const deleteTask = async (_id: string) => {
    await api.delete(`/tasks/${_id}`);
    setTasks((prev) => prev.filter((task) => task._id !== _id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
} 