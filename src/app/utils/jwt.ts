import jwt from 'jsonwebtoken';
import { envVars } from '../config/env';

interface JWTPayload {
    id: string;
}

export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, envVars.JWT_SECRET, {
        expiresIn: envVars.JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, envVars.JWT_SECRET) as JWTPayload;
};
