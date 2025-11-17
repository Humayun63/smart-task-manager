import { Router } from 'express';
import { registerUser, loginUser } from './auth.controller';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

// POST /auth/register - Register a new user
router.post('/register', catchAsync(registerUser));

// POST /auth/login - Login an existing user
router.post('/login', catchAsync(loginUser));

export const AuthRoutes = router;
