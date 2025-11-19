import { Router } from 'express';
import {
    createTask,
    listTasks,
    getTask,
    updateTask,
    deleteTask,
    getProjectTasks,
    autoReassignTasks,
} from './task.controller';
import { catchAsync } from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

// All task routes require authentication
router.use(authGuard);

// Auto-reassign tasks (before other routes to avoid conflicts)
router.post('/auto-reassign', catchAsync(autoReassignTasks));

// Task CRUD operations
router.post('/', catchAsync(createTask));
router.get('/', catchAsync(listTasks));
router.get('/:id', catchAsync(getTask));
router.put('/:id', catchAsync(updateTask));
router.delete('/:id', catchAsync(deleteTask));

// Get all tasks within a project
router.get('/project/:projectId', catchAsync(getProjectTasks));

export const TaskRoutes = router;