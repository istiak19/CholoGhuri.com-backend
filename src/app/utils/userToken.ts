import { generateToken } from "./jwt";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";

export const userCreateToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN);
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES_IN);

    return {
        accessToken,
        refreshToken
    };
};