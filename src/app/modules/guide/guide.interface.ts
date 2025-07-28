import { Types } from "mongoose";

export interface IGuide {
    user: Types.ObjectId;
    nidPhoto: string;
    division: Types.ObjectId;
    status: "PENDING" | "APPROVED" | "REJECTED"
};