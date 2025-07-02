import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';

export const getEmployees = async (_req: Request, res: Response): Promise<void> => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add employee' });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await employeeService.updateEmployeeById(req.params.id, req.body);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update employee' });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await employeeService.deleteEmployeeById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete employee' });
  }
}; 