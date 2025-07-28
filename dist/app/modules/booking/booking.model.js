"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    tour: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "tour",
        required: true
    },
    address: {
        type: String
    },
    guestCount: {
        type: Number
    },
    phone: {
        type: String
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETE", "CANCELLED", "FAILED"],
        default: "PENDING"
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "payment"
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.Booking = (0, mongoose_1.model)("booking", bookingSchema);
