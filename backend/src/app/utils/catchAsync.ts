import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper function to catch async errors in Express route handlers
 * Passes errors to the next() middleware (global error handler)
 */
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
