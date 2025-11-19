// @ts-nocheck
import { z } from 'zod';

// Registration validation schema
export const registerSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
    }).min(1, 'Name is required'),
    email: z.string({
        required_error: 'Email is required',
    }).email('Invalid email format'),
    password: z.string({
        required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters'),
});

// Login validation schema
export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
    }).email('Invalid email format'),
    password: z.string({
        required_error: 'Password is required',
    }).min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
