import Attendance from '../models/Attendance';

export const getAllAttendanceLogs = async () => {
  try {
    return await Attendance.find()
      .populate('employee', 'name')
      .sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    throw error;
  }
};

export const createAttendanceLog = (data: any) =>
  Attendance.create(data);

export const getPopulatedAttendanceLogById = (id: string) =>
  Attendance.findById(id).populate('employee', 'name'); 