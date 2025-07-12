import bcrypt from "bcryptjs";
import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isExist = await User.findOne({ email });
    if (!isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }
    const isMatchPassword = await bcrypt.compare(
        password as string,
        isExist.password as string
    );
    if (!isMatchPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
    };

    const jwtPayload = {
        userId: isExist._id,
        email: isExist.email,
        role: isExist.role
    };
    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN);

    return {
        accessToken
    };
};

export const authService = {
    credentialsLogin
};