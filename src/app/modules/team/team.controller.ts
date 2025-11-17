import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Team } from './team.model';
import { User } from '../auth/auth.model';
import AppError from '../../errorHelpers/AppError';

/**
 * Since 1.0.0
 * Create a new team
 * POST /teams
 */
export const createTeam = async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    if (!name || !name.trim()) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Team name is required');
    }

    const team = await Team.create({
        name: name.trim(),
        owner: userId,
        members: [],
    });

    // Add team to user's teams array
    await User.findByIdAndUpdate(userId, {
        $push: { teams: team._id },
    });

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Team created successfully',
        data: {
            team: {
                id: team._id,
                name: team.name,
                owner: team.owner,
                members: team.members,
                createdAt: team.createdAt,
                updatedAt: team.updatedAt,
            },
        },
    });
};

/**
 * Since 1.0.0
 * Add members to a team
 * POST /teams/:teamId/members
 */
export const addTeamMembers = async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { members } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Members array is required and must not be empty');
    }

    // Validate member structure
    for (const member of members) {
        if (!member.name || !member.role || member.capacity === undefined) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Each member must have name, role, and capacity');
        }
        if (typeof member.capacity !== 'number' || member.capacity < 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Capacity must be a non-negative number');
        }
    }

    const team = await Team.findById(teamId);

    if (!team) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only team owner can add members');
    }

    // Add members to the team
    team.members.push(...members);
    await team.save();

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Members added successfully',
        data: {
            team: {
                id: team._id,
                name: team.name,
                owner: team.owner,
                members: team.members,
                createdAt: team.createdAt,
                updatedAt: team.updatedAt,
            },
        },
    });
};

/**
 * Since 1.0.0
 * List all teams for the authenticated user
 * GET /teams
 */
export const listTeams = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    // Find all teams where the user is the owner
    const teams = await Team.find({ owner: userId }).populate('owner', 'name email');

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Teams retrieved successfully',
        data: {
            teams: teams.map((team) => ({
                id: team._id,
                name: team.name,
                owner: team.owner,
                members: team.members,
                createdAt: team.createdAt,
                updatedAt: team.updatedAt,
            })),
        },
    });
};

/**
 * Since 1.0.0
 * Get a single team by ID
 * GET /teams/:teamId
 */
export const getTeam = async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const team = await Team.findById(teamId).populate('owner', 'name email');

    if (!team) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    // Check if user is the owner
    if (team.owner._id.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You can only view your own teams');
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Team retrieved successfully',
        data: {
            team: {
                id: team._id,
                name: team.name,
                owner: team.owner,
                members: team.members,
                createdAt: team.createdAt,
                updatedAt: team.updatedAt,
            },
        },
    });
};
