import { Server, Socket } from 'socket.io';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';

export function registerAttendanceSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('New client connected');

    socket.on('attendance:punch', async (data, callback) => {
      const { employeeId, employeeName, type } = data;
      console.log('Punch event received:', data);

      try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
          console.log('Employee not found:', employeeId);
          callback?.({ error: 'Employee not found' });
          return;
        }

        const log = await Attendance.create({ employee: employeeId, type });
        const populatedLog = await Attendance.findById(log._id).populate('employee', 'name');
        const eventLog = {
          _id: populatedLog?._id,
          employeeId: populatedLog?.employee._id,
          employeeName: (populatedLog?.employee as any).name,
          type: populatedLog?.type,
          timestamp: populatedLog?.timestamp,
        };

        console.log('Attendance log created:', eventLog);
        io.emit('attendance:update', eventLog);
        callback?.(eventLog);
      } catch (err) {
        console.error('Error processing punch event:', err);
        callback?.({ error: 'Failed to punch' });
      }
    });
  });
}