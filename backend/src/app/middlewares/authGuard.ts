import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt';
import { User } from '../modules/auth/auth.model';
import AppError from '../errorHelpers/AppError';
import { IUser } from '../modules/auth/auth.interface';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

/**
 * Authentication Guard Middleware
 * Verifies JWT token and attaches user to request object
 */
export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (error) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
        }

        // Find user by ID from token payload
        const user = await User.findById(decoded.id);
        
        if (!user) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
        }

        // Attach user to request object
        req.user = user;
        
        next();
    } catch (error) {
        next(error);
    }
};
