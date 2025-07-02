import { Request, Response } from 'express';
import * as attendanceService from '../services/attendanceService';
import Employee from '../models/Employee';

interface SocketRequest extends Request {
  io?: any;
}

export const getAttendanceLogs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const logs = await attendanceService.getAllAttendanceLogs();
    const formatted = logs
      .filter((log: any) => log.employee) // Filter out logs with missing employee references
      .map((log: any) => ({
        _id: log._id,
        employeeId: log.employee._id,
        employeeName: log.employee.name,
        type: log.type,
        timestamp: log.timestamp,
      }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching attendance logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const punch = async (req: SocketRequest, res: Response): Promise<void> => {
  const { employeeId, type } = req.body;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    const log = await attendanceService.createAttendanceLog({ employee: employeeId, type });
    // Populate employee name for the event
    const populatedLog: any = await attendanceService.getPopulatedAttendanceLogById(String(log._id));
    const eventLog = {
      _id: populatedLog?._id,
      employeeId: populatedLog?.employee._id,
      employeeName: populatedLog?.employee.name,
      type: populatedLog?.type,
      timestamp: populatedLog?.timestamp,
    };
    if (req.io) {
      req.io.emit('attendance:update', eventLog);
    }
    res.status(201).json(eventLog);
  } catch (err) {
    res.status(400).json({ message: 'Failed to punch' });
  }
}; 