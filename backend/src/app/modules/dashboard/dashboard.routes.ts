import { Router } from 'express';
import { getDashboard } from './dashboard.controller';
import { catchAsync } from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

// All dashboard routes require authentication
router.use(authGuard);

// Dashboard analytics
router.get('/', catchAsync(getDashboard));

export const DashboardRoutes = router;
