import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../controllers/employeeController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/public', asyncHandler(getEmployees));

router.get('/', authenticate, asyncHandler(getEmployees));
router.post('/', authenticate, authorize('superadmin'), asyncHandler(addEmployee));
router.put('/:id', authenticate, authorize('superadmin'), asyncHandler(updateEmployee));
router.delete('/:id', authenticate, authorize('superadmin'), asyncHandler(deleteEmployee));

export default router; 