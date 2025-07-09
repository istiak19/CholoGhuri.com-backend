/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { AppError } from "../errors/AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";

    if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: {
            name: err.name || "Error",
            stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
        },
    });
};

export default globalErrorHandler;