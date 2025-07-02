import Employee from '../models/Employee';

export const getAllEmployees = () => Employee.find();
export const createEmployee = (data: any) => Employee.create(data);
export const updateEmployeeById = (id: string, data: any) => Employee.findByIdAndUpdate(id, data, { new: true });
export const deleteEmployeeById = (id: string) => Employee.findByIdAndDelete(id); 