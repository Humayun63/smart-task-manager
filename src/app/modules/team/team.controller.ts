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

/**
 * Since 1.0.0
 * Update a team
 * PUT /teams/:teamId
 */
export const updateTeam = async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { name } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    if (!name || !name.trim()) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Team name is required');
    }

    const team = await Team.findById(teamId);

    if (!team) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only team owner can update team');
    }

    team.name = name.trim();
    await team.save();

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Team updated successfully',
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
 * Delete a team
 * DELETE /teams/:teamId
 */
export const deleteTeam = async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const team = await Team.findById(teamId);

    if (!team) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only team owner can delete team');
    }

    await Team.findByIdAndDelete(teamId);

    // Remove team from user's teams array
    await User.findByIdAndUpdate(userId, {
        $pull: { teams: teamId },
    });

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Team deleted successfully',
        data: null,
    });
};

/**
 * Since 1.0.0
 * Get all members of a team
 * GET /teams/:teamId/members
 */
export const getTeamMembers = async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const team = await Team.findById(teamId);

    if (!team) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You can only view your own team members');
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Team members retrieved successfully',
        data: {
            members: team.members,
        },
    });
};

/**
 * Since 1.0.0
 * Update a single team member
 * PUT /teams/:teamId/members/:memberId
 */
export const updateTeamMember = async (req: Request, res: Response) => {
    const { teamId, memberId } = req.params;
    const { name, role, capacity } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    if (!name && !role && capacity === undefined) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'At least one field (name, role, or capacity) must be provided');
    }

    if (capacity !== undefined && (typeof capacity !== 'number' || capacity < 0)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Capacity must be a non-negative number');
    }

    const team = await Team.findById(teamId);

    if (!team) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only team owner can update members');
    }

    // Find the member
    const member = team.members.id(memberId);

    if (!member) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team member not found');
    }

    // Update member fields
    if (name) member.name = name.trim();
    if (role) member.role = role.trim();
    if (capacity !== undefined) member.capacity = capacity;

    await team.save();

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Team member updated successfully',
        data: {
            member: {
                id: member._id,
                name: member.name,
                role: member.role,
                capacity: member.capacity,
            },
        },
    });
};

/**
 * Since 1.0.0
 * Delete a single team member
 * DELETE /teams/:teamId/members/:memberId
 */
export const deleteTeamMember = async (req: Request, res: Response) => {
    const { teamId, memberId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }

    const team = await Team.findById(teamId);

    if (!team) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team not found');
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId.toString()) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Only team owner can delete members');
    }

    // Find the member
    const member = team.members.id(memberId);

    if (!member) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Team member not found');
    }

    // Remove the member using pull
    team.members.pull(memberId);
    await team.save();

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Team member deleted successfully',
        data: null,
    });
};
