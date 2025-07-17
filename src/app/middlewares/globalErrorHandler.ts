/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from "zod";
import { envVars } from "../config/env";
import { AppError } from "../errors/AppError";
import { Request, Response, NextFunction } from "express";
import { handleZodError } from "../errors/handleZodError";
import { handleCastError } from "../errors/handleCastError";
import { handleDuplicateError } from "../errors/handleDuplicateError";
import { handleMongooseValidationError } from "../errors/handleMongooseValidationError";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";

    //  // Duplicate Key Error
    if (err.code === 11000) {
        const simplified = handleDuplicateError(err);
        statusCode = simplified.statusCode;
        message = simplified.message;
    }

    // CastError
    else if (err.name === "CastError") {
        const simplified = handleCastError(err);
        statusCode = simplified.statusCode;
        message = simplified.message;
    }

    // Mongoose ValidationError
    else if (err.name === "ValidationError") {
        const simplified = handleMongooseValidationError(err);
        return res.status(simplified.statusCode).json({
            success: false,
            message: simplified.message,
            errorMessages: simplified.errorMessages,
        });
    }

    // Handle Zod Validation Error
    else if (err instanceof ZodError) {
        const simplified = handleZodError(err);
        return res.status(simplified.statusCode).json({
            success: false,
            message: simplified.message,
            errorMessages: simplified.errorMessages,
        });
    }

    //   // AppError
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        message = err.message;
    }

    // Default error response
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