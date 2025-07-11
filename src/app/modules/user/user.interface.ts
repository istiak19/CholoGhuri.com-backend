import { Types } from "mongoose"

export interface IAuthProvider {
    provider: "credentials" | "google",
    providerId: string
};

export interface IUser {
    name: string,
    email: string,
    password?: string,
    role: "ADMIN" | "USER" | "SUPER_ADMIN" | "GUIDE",
    phone?: string,
    picture?: string,
    address?: string,
    isDeleted?: boolean,
    isActive?: "Active" | "Inactive" | "Blocked",
    isVerified?: boolean,
    auths: IAuthProvider[],
    bookings?: Types.ObjectId[],
    guides?: Types.ObjectId[]
};