import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { getTasks, addTask, updateTask, deleteTask } from '../controllers/taskController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(getTasks));
router.post('/', authenticate, authorize('superadmin'), asyncHandler(addTask));
router.put('/:id', authenticate, authorize('superadmin'), asyncHandler(updateTask));
router.delete('/:id', authenticate, authorize('superadmin'), asyncHandler(deleteTask));

export default router; 