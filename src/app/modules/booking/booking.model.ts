import { model, Schema } from "mongoose";
import { IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    tour: {
        type: Schema.Types.ObjectId,
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
        enum: ["PENDING", "COMPLETE", "CANCEL", "FAILED"],
        default: "PENDING"
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: "payment"
    }
}, {
    versionKey: false,
    timestamps: true
});

export const Booking = model<IBooking>("booking", bookingSchema);