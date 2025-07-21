import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "Unauthorized access: No token provided");
        };
        
        const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET) as JwtPayload;

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "Unauthorized access: Insufficient role");
        };
        req.user = verifiedToken
        next()
    } catch (err) {
        next(err)
    }
};