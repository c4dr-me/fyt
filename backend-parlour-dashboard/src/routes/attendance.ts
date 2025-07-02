import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { getAttendanceLogs, punch } from '../controllers/attendanceController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/public', asyncHandler(getAttendanceLogs));

router.get('/', authenticate, asyncHandler(getAttendanceLogs));
router.post('/punch', asyncHandler(punch)); 

export default router; 