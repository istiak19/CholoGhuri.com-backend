/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IAuthProvider, IUser } from "../modules/user/user.interface";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            // console.log("Super Admin already exist!");
            return;
        };
        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        };
        const hashPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, 10);
        const payload: IUser = {
            name: "Istiak Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            isVerified: true,
            role: "SUPER_ADMIN",
            password: hashPassword,
            auths: [authProvider]
        };
        await User.create(payload);
    } catch (error) {
        // console.log(error)
    }
};