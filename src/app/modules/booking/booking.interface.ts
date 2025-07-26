import { Types } from "mongoose";

export interface IBooking {
    user: Types.ObjectId;
    tour: Types.ObjectId;
    guestCount: number;
    phone: string;
    address: string;
    status: "PENDING" | "COMPLETE" | "CANCELLED" | "FAILED";
    payment?: Types.ObjectId;
    createdAt: Date
};