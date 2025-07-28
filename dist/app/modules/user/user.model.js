"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const authProviderSchema = new mongoose_1.Schema({
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
const userSchema = new mongoose_1.Schema({
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
    auths: [authProviderSchema],
    bookings: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "booking",
        default: []
    },
    //  guides: {
    //     type: [Schema.Types.ObjectId],
    //     ref: "guide",
    //     default: []
    // }
}, {
    versionKey: false,
    timestamps: true
});
exports.User = (0, mongoose_1.model)("user", userSchema);
