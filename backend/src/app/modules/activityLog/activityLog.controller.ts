import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ActivityLog } from './activityLog.model';
import { Team } from '../team/team.model';
import { Project } from '../project/project.model';
import { Task } from '../task/task.model';
import AppError from '../../errorHelpers/AppError';

/**
 * Since 1.0.0
 * Create a new activity log
 * POST /activity-log
 */
export const createLog = async (req: Request, res: Response) => {
    const { taskId, projectId, teamId, message } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    // Validate required fields
    if (!teamId) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Team ID is required');
    }

    if (!message || !message.trim()) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Message is required');
    }

    // Verify team exists and user has access to it
    const team = await Team.findById(teamId);
    if (!team) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    if (team.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You can only create logs for your own teams');
    }

    // If projectId is provided, verify it exists and belongs to the team
    if (projectId) {
        const project = await Project.findById(projectId);
        if (!project) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
        }
        if (project.team.toString() !== teamId) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Project does not belong to the specified team');
        }
    }

    // If taskId is provided, verify it exists
    if (taskId) {
        const task = await Task.findById(taskId);
        if (!task) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
        }
        if (task.team.toString() !== teamId) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Task does not belong to the specified team');
        }
    }

    const activityLog = await ActivityLog.create({
        taskId: taskId || undefined,
        projectId: projectId || undefined,
        teamId,
        message: message.trim(),
        timestamp: new Date(),
        createdBy: userId,
    });

    // Populate references
    await activityLog.populate('teamId', 'name');
    await activityLog.populate('projectId', 'name');
    await activityLog.populate('taskId', 'title');
    await activityLog.populate('createdBy', 'name email');

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Activity log created successfully',
        data: {
            log: {
                id: activityLog._id,
                taskId: activityLog.taskId,
                projectId: activityLog.projectId,
                teamId: activityLog.teamId,
                message: activityLog.message,
                timestamp: activityLog.timestamp,
                createdBy: activityLog.createdBy,
            },
        },
    });
};

/**
 * Since 1.0.0
 * Get activity logs with filters
 * GET /activity-log?teamId=xxx&projectId=xxx&taskId=xxx&limit=50
 */
export const getLogs = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    // Build filter query
    const filter: any = {};

    // Filter by team
    if (req.query.teamId) {
        const team = await Team.findById(req.query.teamId);
        if (!team) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
        }
        if (team.owner.toString() !== userId.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You can only view logs from your own teams');
        }
        filter.teamId = req.query.teamId;
    } else {
        // If no teamId provided, get all teams owned by user
        const userTeams = await Team.find({ owner: userId });
        const teamIds = userTeams.map((team) => team._id);
        filter.teamId = { $in: teamIds };
    }

    // Filter by project
    if (req.query.projectId) {
        const project = await Project.findById(req.query.projectId);
        if (!project) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
        }
        if (project.owner.toString() !== userId.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You can only view logs from your own projects');
        }
        filter.projectId = req.query.projectId;
    }

    // Filter by task
    if (req.query.taskId) {
        const task = await Task.findById(req.query.taskId);
        if (!task) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
        }
        if (task.owner.toString() !== userId.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You can only view logs from your own tasks');
        }
        filter.taskId = req.query.taskId;
    }

    // Set limit (default 50, max 200)
    let limit = 50;
    if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string);
        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid limit value');
        }
        limit = Math.min(parsedLimit, 200);
    }

    const logs = await ActivityLog.find(filter)
        .populate('teamId', 'name')
        .populate('projectId', 'name')
        .populate('taskId', 'title')
        .populate('createdBy', 'name email')
        .sort({ timestamp: -1 })
        .limit(limit);

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Activity logs retrieved successfully',
        data: {
            logs: logs.map((log) => ({
                id: log._id,
                taskId: log.taskId,
                projectId: log.projectId,
                teamId: log.teamId,
                message: log.message,
                timestamp: log.timestamp,
                createdBy: log.createdBy,
            })),
            filters: {
                teamId: req.query.teamId || null,
                projectId: req.query.projectId || null,
                taskId: req.query.taskId || null,
                limit,
            },
            count: logs.length,
        },
    });
};

/**
 * Since 1.0.0
 * Get a single activity log by ID
 * GET /activity-log/:id
 */
export const getLogById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const log = await ActivityLog.findById(id)
        .populate('teamId', 'name')
        .populate('projectId', 'name')
        .populate('taskId', 'title')
        .populate('createdBy', 'name email');

    if (!log) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Activity log not found');
    }

    // Verify user has access to this log (via team ownership)
    const team = await Team.findById(log.teamId);
    if (!team || team.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You can only view logs from your own teams');
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Activity log retrieved successfully',
        data: {
            log: {
                id: log._id,
                taskId: log.taskId,
                projectId: log.projectId,
                teamId: log.teamId,
                message: log.message,
                timestamp: log.timestamp,
                createdBy: log.createdBy,
            },
        },
    });
};