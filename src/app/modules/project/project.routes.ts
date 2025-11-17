import { Router } from 'express';
import {
    createProject,
    listProjects,
    getProject,
    updateProject,
    deleteProject,
} from './project.controller';
import { catchAsync } from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

// All project routes require authentication
router.use(authGuard);

// Project CRUD operations
router.post('/', catchAsync(createProject));
router.get('/', catchAsync(listProjects));
router.get('/:id', catchAsync(getProject));
router.put('/:id', catchAsync(updateProject));
router.delete('/:id', catchAsync(deleteProject));

export const ProjectRoutes = router;