import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { TeamRoutes } from '../modules/team/team.routes';
import { ProjectRoutes } from '../modules/project/project.routes';
import { TaskRoutes } from '../modules/task/task.routes';

const router = Router();

// Module routes
const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/teams',
        route: TeamRoutes,
    },
    {
        path: '/projects',
        route: ProjectRoutes,
    },
    {
        path: '/tasks',
        route: TaskRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
