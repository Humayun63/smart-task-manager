import { Router } from 'express';
import {
    createLog,
    getLogs,
    getLogById,
} from './activityLog.controller';
import { catchAsync } from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

// All activity log routes require authentication
router.use(authGuard);

// Activity log operations
router.post('/', catchAsync(createLog));
router.get('/', catchAsync(getLogs));
router.get('/:id', catchAsync(getLogById));

export const ActivityLogRoutes = router;
