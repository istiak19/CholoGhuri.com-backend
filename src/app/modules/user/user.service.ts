import bcrypt from "bcryptjs";
import { User } from "./user.model";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import { IAuthProvider, IUser } from "./user.interface";

const userAllGetService = async () => {
    const user = await User.find();
    const totalUser = await User.countDocuments();
    return {
        user,
        totalUser
    };
}

const userCreateService = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    const isExist = await User.findOne({ email });
    if (isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
    };
    const hashPassword = await bcrypt.hash(password as string, 10);
    const auth: IAuthProvider = { provider: "credentials", providerId: email as string }
    const user = await User.create({
        email,
        password: hashPassword,
        auths: [auth],
        ...rest
    });
    return user;
};

const userUpdateService = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isExistUser = await User.findById(userId);
    if (!isExistUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    };
    if (payload.role) {
        if (decodedToken.role === "USER" || decodedToken.role === "GUIDE") {
            throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access to change role");
        };
    };
    if (payload.role === "SUPER_ADMIN" && decodedToken.role === "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "Only SUPER_ADMIN can assign this role");
    };
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === "USER" || decodedToken.role === "GUIDE") {
            throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access to modify user status");
        };
    };
    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
    };
    const userUpdated = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return userUpdated
};

export const userServices = {
    userAllGetService,
    userCreateService,
    userUpdateService
};