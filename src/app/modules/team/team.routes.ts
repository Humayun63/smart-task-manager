import { Router } from 'express';
import { createTeam, addTeamMembers, listTeams, getTeam } from './team.controller';
import { catchAsync } from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

router.use(authGuard);
router.post('/', catchAsync(createTeam));
router.get('/', catchAsync(listTeams));
router.get('/:teamId', catchAsync(getTeam));
router.post('/:teamId/members', catchAsync(addTeamMembers));

export const TeamRoutes = router;
