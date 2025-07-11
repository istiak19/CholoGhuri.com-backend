import bcrypt from "bcryptjs";
import { User } from "./user.model";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { IAuthProvider, IUser } from "./user.interface";

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

const userAllGetService = async () => {
    const user = await User.find();
    const totalUser = await User.countDocuments();
    return {
        user,
        totalUser
    };
}

export const userServices = {
    userCreateService,
    userAllGetService,
}