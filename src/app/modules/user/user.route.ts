import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import { userControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { verifyToken } from "../../utils/jwt";

const router = Router();

router.get("/all-user", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "Unauthorized access: No token provided");
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET) as JwtPayload;
        if (verifiedToken.role !== "USER" && verifiedToken.role !== "SUPER_ADMIN") {
            throw new AppError(403, "Unauthorized access: Insufficient role");
        }
        next()
    } catch (err) {
        next(err)
    }
}, userControllers.allGetUser);
router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);

export const userRouter = router;