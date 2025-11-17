import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Project } from './project.model';
import { Team } from '../team/team.model';
import AppError from '../../errorHelpers/AppError';

/**
 * Since 1.0.0
 * Create a new project
 * POST /projects
 */
export const createProject = async (req: Request, res: Response) => {
    const { name, description, team } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    if (!name || !name.trim()) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Project name is required');
    }

    if (!team) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Team is required');
    }

    // Verify team exists and user is the owner
    const teamDoc = await Team.findById(team);
    if (!teamDoc) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    if (teamDoc.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You can only create projects for teams you own');
    }

    const project = await Project.create({
        name: name.trim(),
        description: description?.trim(),
        team,
        owner: userId,
    });

    // Populate team and owner
    await project.populate('team', 'name');
    await project.populate('owner', 'name email');

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Project created successfully',
        data: {
            project: {
                id: project._id,
                name: project.name,
                description: project.description,
                team: project.team,
                owner: project.owner,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        },
    });
};

/**
 * Since 1.0.0
 * List all projects for the authenticated user
 * GET /projects
 */
export const listProjects = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    // Find all projects where the user is the owner
    const projects = await Project.find({ owner: userId })
        .populate('team', 'name')
        .populate('owner', 'name email')
        .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Projects retrieved successfully',
        data: {
            projects: projects.map((project) => ({
                id: project._id,
                name: project.name,
                description: project.description,
                team: project.team,
                owner: project.owner,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            })),
        },
    });
};

/**
 * Since 1.0.0
 * Get a single project by ID
 * GET /projects/:id
 */
export const getProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const project = await Project.findById(id)
        .populate('team', 'name')
        .populate('owner', 'name email');

    if (!project) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
    }

    // Check if user is the owner
    if (project.owner._id.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You can only view your own projects');
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Project retrieved successfully',
        data: {
            project: {
                id: project._id,
                name: project.name,
                description: project.description,
                team: project.team,
                owner: project.owner,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        },
    });
};

/**
 * Since 1.0.0
 * Update a project
 * PUT /projects/:id
 */
export const updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, team } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    if (!name && !description && !team) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'At least one field must be provided');
    }

    const project = await Project.findById(id);

    if (!project) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
    }

    // Check if user is the owner
    if (project.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only project owner can update project');
    }

    // If team is being updated, verify it exists and user owns it
    if (team && team !== project.team.toString()) {
        const teamDoc = await Team.findById(team);
        if (!teamDoc) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
        }
        if (teamDoc.owner.toString() !== userId.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You can only assign projects to teams you own');
        }
        project.team = team;
    }

    // Update fields
    if (name) project.name = name.trim();
    if (description !== undefined) project.description = description?.trim();

    await project.save();

    // Populate team and owner
    await project.populate('team', 'name');
    await project.populate('owner', 'name email');

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Project updated successfully',
        data: {
            project: {
                id: project._id,
                name: project.name,
                description: project.description,
                team: project.team,
                owner: project.owner,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        },
    });
};

/**
 * Since 1.0.0
 * Delete a project
 * DELETE /projects/:id
 */
export const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const project = await Project.findById(id);

    if (!project) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
    }

    // Check if user is the owner
    if (project.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only project owner can delete project');
    }

    await Project.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Project deleted successfully',
        data: null,
    });
};