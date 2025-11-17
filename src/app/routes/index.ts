import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { TeamRoutes } from '../modules/team/team.routes';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
