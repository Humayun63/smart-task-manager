import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from './auth.model';
import { registerSchema, loginSchema } from './auth.validation';
import { generateToken } from '../../utils/jwt';
import AppError from '../../errorHelpers/AppError';

/**
 * Register a new user
 * Validates request, hashes password (via model hook), saves user, returns JWT token
 */
export const registerUser = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const validatedData = registerSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            throw new AppError(StatusCodes.CONFLICT, 'Email already registered');
        }

        // Create new user (password will be hashed by pre-save hook)
        const user = await User.create(validatedData);

        // Generate JWT token
        const token = generateToken({ id: user._id.toString() });

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Login user
 * Finds user by email, compares password, returns JWT token
 */
export const loginUser = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const validatedData = loginSchema.parse(req.body);

        // Find user by email (include password for comparison)
        const user = await User.findOne({ email: validatedData.email }).select('+password');
        if (!user) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(validatedData.password);
        if (!isPasswordValid) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
        }

        // Generate JWT token
        const token = generateToken({ id: user._id.toString() });

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        throw error;
    }
};
