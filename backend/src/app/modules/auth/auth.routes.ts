import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser } from './auth.controller';
import { catchAsync } from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

router.post('/register', catchAsync(registerUser));
router.post('/login', catchAsync(loginUser));
router.post('/logout', catchAsync(logoutUser));
router.get('/me', authGuard, catchAsync(getCurrentUser));

export const AuthRoutes = router;
