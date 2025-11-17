import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from './auth.controller';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.post('/register', catchAsync(registerUser));
router.post('/login', catchAsync(loginUser));
router.post('/logout', catchAsync(logoutUser));

export const AuthRoutes = router;
