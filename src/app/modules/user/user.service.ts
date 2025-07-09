import { User } from "./user.model";
import { IUser } from "./user.interface";

const userCreateService = async (payload: Partial<IUser>) => {
    const { name, email } = payload;
    const user = await User.create({ name, email });
    return user;
};

export const userServices = {
    userCreateService,
}