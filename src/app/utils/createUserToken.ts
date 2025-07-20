import httpStatus from 'http-status';
import { generateToken, verifyToken } from "./jwt";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { AppError } from "../errors/AppError";
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';

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


export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
    const isExist = await User.findOne({ email: verifiedRefreshToken.email });
    if (!isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    };
    if (isExist.isActive === "Blocked" || isExist.isActive === "Inactive") {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isExist.isActive}`);
    }
    if (isExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
    };
    const jwtPayload = {
        userId: isExist._id,
        email: isExist.email,
        role: isExist.role
    };
    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN);
    return accessToken;
};