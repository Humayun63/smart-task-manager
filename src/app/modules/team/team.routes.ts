import { Router } from 'express';
import { 
    createTeam, 
    addTeamMembers, 
    listTeams, 
    getTeam,
    updateTeam,
    deleteTeam,
    getTeamMembers,
    updateTeamMember,
    deleteTeamMember
} from './team.controller';
import { catchAsync } from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

router.use(authGuard);

// Team routes
router.post('/', catchAsync(createTeam));
router.get('/', catchAsync(listTeams));
router.get('/:teamId', catchAsync(getTeam));
router.put('/:teamId', catchAsync(updateTeam));
router.delete('/:teamId', catchAsync(deleteTeam));

// Team members routes
router.get('/:teamId/members', catchAsync(getTeamMembers));
router.post('/:teamId/members', catchAsync(addTeamMembers));
router.put('/:teamId/members/:memberId', catchAsync(updateTeamMember));
router.delete('/:teamId/members/:memberId', catchAsync(deleteTeamMember));

export const TeamRoutes = router;
