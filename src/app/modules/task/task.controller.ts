import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Task } from './task.model';
import { Project } from '../project/project.model';
import { Team } from '../team/team.model';
import { TaskPriority, TaskStatus } from './task.interface';
import AppError from '../../errorHelpers/AppError';
import { Types } from 'mongoose';

/**
 * Since 1.0.0
 * Create a new task
 * POST /tasks
 */
export const createTask = async (req: Request, res: Response) => {
    const { 
        title, 
        description, 
        priority, 
        status, 
        project, 
        assignedMember 
    } = req.body;
    
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    // Validate required fields
    if (!title || !title.trim()) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Task title is required');
    }

    if (!description || !description.trim()) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Task description is required');
    }

    if (!priority) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Task priority is required');
    }

    if (!Object.values(TaskPriority).includes(priority)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid priority value');
    }

    if (status && !Object.values(TaskStatus).includes(status)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid status value');
    }

    if (!project) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Project is required');
    }

    // Verify project exists and user is the owner
    const projectDoc = await Project.findById(project).populate('team');
    if (!projectDoc) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
    }

    if (projectDoc.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You can only create tasks for your own projects');
    }

    // Get team from project
    const teamId = projectDoc.team;

    // If assignedMember is provided, verify it exists in the team
    if (assignedMember) {
        const team = await Team.findById(teamId);
        if (!team) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
        }

        const memberExists = team.members.id(assignedMember);
        if (!memberExists) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Assigned member not found in team');
        }
    }

    const task = await Task.create({
        title: title.trim(),
        description: description.trim(),
        priority,
        status: status || TaskStatus.PENDING,
        project,
        team: teamId,
        assignedMember: assignedMember || undefined,
        owner: userId,
    });

    // Populate references
    await task.populate('project', 'name');
    await task.populate('team', 'name');
    await task.populate('owner', 'name email');

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Task created successfully',
        data: {
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                project: task.project,
                team: task.team,
                assignedMember: task.assignedMember,
                owner: task.owner,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            },
        },
    });
};

/**
 * Since 1.0.0
 * List all tasks with optional filters
 * GET /tasks?project=xxx&member=xxx&priority=xxx&status=xxx
 */
export const listTasks = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    // Build filter query
    const filter: any = { owner: userId };

    // Filter by project
    if (req.query.project) {
        filter.project = req.query.project;
    }

    // Filter by assigned member
    if (req.query.member) {
        filter.assignedMember = req.query.member;
    }

    // Filter by priority
    if (req.query.priority) {
        if (!Object.values(TaskPriority).includes(req.query.priority as TaskPriority)) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid priority filter');
        }
        filter.priority = req.query.priority;
    }

    // Filter by status
    if (req.query.status) {
        if (!Object.values(TaskStatus).includes(req.query.status as TaskStatus)) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid status filter');
        }
        filter.status = req.query.status;
    }

    const tasks = await Task.find(filter)
        .populate('project', 'name')
        .populate('team', 'name')
        .populate('owner', 'name email')
        .sort({ createdAt: -1 });

    // Manually populate assignedMember details from team
    const tasksWithMembers = await Promise.all(
        tasks.map(async (task) => {
            let assignedMemberDetails = null;
            if (task.assignedMember) {
                const team = await Team.findById(task.team);
                if (team) {
                    const member = team.members.id(task.assignedMember);
                    if (member) {
                        assignedMemberDetails = {
                            id: member._id,
                            name: member.name,
                            role: member.role,
                            capacity: member.capacity,
                        };
                    }
                }
            }

            return {
                id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                project: task.project,
                team: task.team,
                assignedMember: assignedMemberDetails,
                owner: task.owner,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            };
        })
    );

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: {
            tasks: tasksWithMembers,
            filters: {
                project: req.query.project || null,
                member: req.query.member || null,
                priority: req.query.priority || null,
                status: req.query.status || null,
            },
        },
    });
};

/**
 * Since 1.0.0
 * Get a single task by ID
 * GET /tasks/:id
 */
export const getTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const task = await Task.findById(id)
        .populate('project', 'name')
        .populate('team', 'name')
        .populate('owner', 'name email');

    if (!task) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
    }

    // Check if user is the owner
    if (task.owner._id.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You can only view your own tasks');
    }

    // Get assigned member details
    let assignedMemberDetails = null;
    if (task.assignedMember) {
        const team = await Team.findById(task.team);
        if (team) {
            const member = team.members.id(task.assignedMember);
            if (member) {
                assignedMemberDetails = {
                    id: member._id,
                    name: member.name,
                    role: member.role,
                    capacity: member.capacity,
                };
            }
        }
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Task retrieved successfully',
        data: {
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                project: task.project,
                team: task.team,
                assignedMember: assignedMemberDetails,
                owner: task.owner,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            },
        },
    });
};

/**
 * Since 1.0.0
 * Update a task
 * PUT /tasks/:id
 */
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, priority, status, assignedMember } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    if (!title && !description && !priority && !status && assignedMember === undefined) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'At least one field must be provided');
    }

    const task = await Task.findById(id);

    if (!task) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
    }

    // Check if user is the owner
    if (task.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only task owner can update task');
    }

    // Validate priority if provided
    if (priority && !Object.values(TaskPriority).includes(priority)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid priority value');
    }

    // Validate status if provided
    if (status && !Object.values(TaskStatus).includes(status)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid status value');
    }

    // If assignedMember is being updated, verify it exists in the team
    if (assignedMember !== undefined) {
        if (assignedMember) {
            const team = await Team.findById(task.team);
            if (!team) {
                throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
            }

            const memberExists = team.members.id(assignedMember);
            if (!memberExists) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'Assigned member not found in team');
            }
            task.assignedMember = assignedMember;
        } else {
            // Unassign member
            task.assignedMember = undefined;
        }
    }

    // Update fields
    if (title) task.title = title.trim();
    if (description) task.description = description.trim();
    if (priority) task.priority = priority;
    if (status) task.status = status;

    await task.save();

    // Populate references
    await task.populate('project', 'name');
    await task.populate('team', 'name');
    await task.populate('owner', 'name email');

    // Get assigned member details
    let assignedMemberDetails = null;
    if (task.assignedMember) {
        const team = await Team.findById(task.team);
        if (team) {
            const member = team.members.id(task.assignedMember);
            if (member) {
                assignedMemberDetails = {
                    id: member._id,
                    name: member.name,
                    role: member.role,
                    capacity: member.capacity,
                };
            }
        }
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Task updated successfully',
        data: {
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                project: task.project,
                team: task.team,
                assignedMember: assignedMemberDetails,
                owner: task.owner,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            },
        },
    });
};

/**
 * Since 1.0.0
 * Delete a task
 * DELETE /tasks/:id
 */
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const task = await Task.findById(id);

    if (!task) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
    }

    // Check if user is the owner
    if (task.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only task owner can delete task');
    }

    await Task.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Task deleted successfully',
        data: null,
    });
};