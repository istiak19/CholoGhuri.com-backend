/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcryptjs";
import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import { AppError } from "../../errors/AppError";
import { createNewAccessTokenWithRefreshToken, userCreateToken } from "../../utils/createUserToken";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isExist = await User.findOne({ email });
    if (!isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    };

    const isMatchPassword = await bcrypt.compare(
        password as string,
        isExist.password as string
    );

    if (!isMatchPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
    };

    // const jwtPayload = {
    //     userId: isExist._id,
    //     email: isExist.email,
    //     role: isExist.role
    // };
    // const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN);
    // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES_IN);

    const token = userCreateToken(isExist);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isExist.toObject();

    return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: rest
    };
};

const credentialsLoginRefresh = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    };
};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string);
    
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "The current password you entered is incorrect");
    };
    user!.password = await bcrypt.hash(newPassword, 10);
    await user!.save();
};

const resetNewPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string);
    
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "The current password you entered is incorrect");
    };
    user!.password = await bcrypt.hash(newPassword, 10);
    await user!.save();
};

export const authService = {
    credentialsLogin,
    credentialsLoginRefresh,
    changePassword,
    resetNewPassword,
};