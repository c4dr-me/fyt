import { Router } from 'express';
import { login, logout, me } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', asyncHandler(authenticate), asyncHandler(me));

export default router; 