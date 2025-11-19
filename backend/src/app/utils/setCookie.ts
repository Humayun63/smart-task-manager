import { Response } from 'express';
import { envVars } from '../config/env';

/**
 * Set JWT token as HTTP-only cookie
 * @param res - Express Response object
 * @param token - JWT token string
 */
export const setTokenCookie = (res: Response, token: string): void => {
    const cookieExpiresIn = parseInt(envVars.JWT_COOKIE_EXPIRES_IN);
    const isProduction = envVars.NODE_ENV === 'production';
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-site cookies in production
        maxAge: cookieExpiresIn * 24 * 60 * 60 * 1000, // Convert days to milliseconds
    });
};
