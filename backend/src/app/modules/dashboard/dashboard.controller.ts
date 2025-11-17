import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Team } from '../team/team.model';
import { Project } from '../project/project.model';
import { Task } from '../task/task.model';
import { ActivityLog } from '../activityLog/activityLog.model';
import AppError from '../../errorHelpers/AppError';
import { Types } from 'mongoose';
import { ITeamMemberSummary } from './dashboard.interface';

/**
 * Since 1.0.0
 * Get dashboard statistics and analytics
 * GET /dashboard?teamId=xxx&projectId=xxx
 */
export const getDashboard = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    // Build filter queries
    const projectFilter: any = { owner: userId };
    const taskFilter: any = { owner: userId };
    let teamFilter: any = { owner: userId };

    // If teamId is provided, validate and filter
    if (req.query.teamId) {
        const team = await Team.findById(req.query.teamId);
        if (!team) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
        }
        if (team.owner.toString() !== userId.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You can only view dashboard for your own teams');
        }
        teamFilter = { _id: req.query.teamId };
        taskFilter.team = req.query.teamId;
    }

    // If projectId is provided, validate and filter
    if (req.query.projectId) {
        const project = await Project.findById(req.query.projectId);
        if (!project) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
        }
        if (project.owner.toString() !== userId.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You can only view dashboard for your own projects');
        }
        projectFilter._id = req.query.projectId;
        taskFilter.project = req.query.projectId;
    }

    // 1. Get total projects
    const totalProjects = await Project.countDocuments(projectFilter);

    // 2. Get total tasks
    const totalTasks = await Task.countDocuments(taskFilter);

    // 3. Build team summary (member tasks vs capacity)
    const teams = await Team.find(teamFilter);
    const teamSummary: ITeamMemberSummary[] = [];

    for (const team of teams) {
        // Get tasks for this team
        const teamTaskFilter = { ...taskFilter, team: team._id };

        for (const member of team.members) {
            // Count tasks assigned to this member
            const currentTasks = await Task.countDocuments({
                ...teamTaskFilter,
                assignedMember: member._id,
            });

            teamSummary.push({
                memberId: member._id,
                memberName: member.name,
                memberRole: member.role,
                currentTasks,
                capacity: member.capacity,
                overloaded: currentTasks > member.capacity,
            });
        }
    }

    // Sort by overloaded first, then by most tasks
    teamSummary.sort((a, b) => {
        if (a.overloaded && !b.overloaded) return -1;
        if (!a.overloaded && b.overloaded) return 1;
        return b.currentTasks - a.currentTasks;
    });

    // 4. Get recent reassignments (last 5 logs)
    const activityLogFilter: any = {};

    if (req.query.teamId) {
        activityLogFilter.teamId = req.query.teamId;
    } else {
        // Get all teams owned by user
        const userTeams = await Team.find({ owner: userId });
        const teamIds = userTeams.map((team) => team._id);
        activityLogFilter.teamId = { $in: teamIds };
    }

    if (req.query.projectId) {
        activityLogFilter.projectId = req.query.projectId;
    }

    // Filter for reassignment-related messages
    activityLogFilter.message = { $regex: /reassign|assigned/i };

    const recentReassignments = await ActivityLog.find(activityLogFilter)
        .populate('taskId', 'title')
        .populate('projectId', 'name')
        .populate('createdBy', 'name email')
        .sort({ timestamp: -1 })
        .limit(5);

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: {
            totalProjects,
            totalTasks,
            teamSummary,
            recentReassignments: recentReassignments.map((log) => ({
                id: log._id,
                message: log.message,
                timestamp: log.timestamp,
                taskId: log.taskId,
                projectId: log.projectId,
                createdBy: log.createdBy,
            })),
            filters: {
                teamId: req.query.teamId || null,
                projectId: req.query.projectId || null,
            },
        },
    });
};