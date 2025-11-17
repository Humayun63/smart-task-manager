import { Router } from 'express';
import {
    createTask,
    listTasks,
    getTask,
    updateTask,
    deleteTask,
} from './task.controller';
import { catchAsync } from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

// All task routes require authentication
router.use(authGuard);

// Task CRUD operations
router.post('/', catchAsync(createTask));
router.get('/', catchAsync(listTasks));
router.get('/:id', catchAsync(getTask));
router.put('/:id', catchAsync(updateTask));
router.delete('/:id', catchAsync(deleteTask));

export const TaskRoutes = router;