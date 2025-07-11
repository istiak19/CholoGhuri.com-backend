import bcrypt from "bcryptjs";
import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

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
    return {
        email: isExist.email
    };
};

export const authService = {
    credentialsLogin
};