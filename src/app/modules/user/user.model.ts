import { model, Schema } from "mongoose";
import { IAuthProvider, IUser } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    _id: false
});

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: { type: String },
    role: {
        type: String,
        enum: ["ADMIN", "USER", "SUPER_ADMIN", "GUIDE"],
        default: "USER"
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    auths: [authProviderSchema]
}, {
    versionKey: false,
    timestamps: true
});

export const User = model("user", userSchema);