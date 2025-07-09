import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({
        success: false,
        message,
        error: {
            name: err.name,
            stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
        },
    });
};