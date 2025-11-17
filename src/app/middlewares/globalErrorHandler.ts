import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const globalErrorHandler =  (error: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = `Something went wrong! ${error.message}`;

    if(error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        error,
        stack: 'development' === envVars.NODE_ENV ? error.stack : null
    })    
}