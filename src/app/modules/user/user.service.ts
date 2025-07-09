import { User } from "./user.model";
import { IUser } from "./user.interface";

const userCreateService = async (payload: Partial<IUser>) => {
    const { name, email } = payload;
    const user = await User.create({ name, email });
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