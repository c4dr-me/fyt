import Task from '../models/Task';

export const getAllTasks = () => Task.find();
export const createTask = (data: any) => Task.create(data);
export const updateTaskById = (id: string, data: any) => Task.findByIdAndUpdate(id, data, { new: true });
export const deleteTaskById = (id: string) => Task.findByIdAndDelete(id); 