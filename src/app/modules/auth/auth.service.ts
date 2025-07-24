/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { sendMail } from "../../utils/sendMail";
import { AppError } from "../../errors/AppError";
import { envVars } from "../../config/env.config";
import { IAuthProvider, IUser } from "../user/user.interface";
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

const resetNewPassword = async (id: string, newPassword: string, decodedToken: JwtPayload) => {
    if (id !== decodedToken.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You can't reset password");
    };
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User dose not found");
    };

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    };

    if (user.password && user.auths.some(providerObjects => providerObjects.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings.");
    };

    const hashPassword = await bcrypt.hash(plainPassword, 10);
    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    };
    const auths: IAuthProvider[] = [...user.auths, credentialProvider];

    user.auths = auths;
    user.password = hashPassword;
    await user.save();
};

const forgetPassword = async (email: string) => {
    const isExistUser = await User.findOne({ email });

    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    };

    if (!isExistUser.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    };

    if (isExistUser.isActive === "Blocked" || isExistUser.isActive === "Inactive") {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isExistUser.isActive}`)
    };

    if (isExistUser.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    };

    const payload = {
        userId: isExistUser._id,
        email: isExistUser.email,
        role: isExistUser.role
    };

    const resetToken = jwt.sign(payload, envVars.JWT_SECRET, {
        expiresIn: "10m"
    });

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isExistUser._id}&token=${resetToken}`;

    sendMail({
        to: isExistUser.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isExistUser.name,
            resetUILink
        }
    });
};

export const authService = {
    credentialsLogin,
    credentialsLoginRefresh,
    changePassword,
    setPassword,
    forgetPassword,
    resetNewPassword,
};