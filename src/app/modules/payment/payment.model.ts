import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
    bookingID: {
        type: Schema.Types.ObjectId,
        ref: "booking",
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["PAID", "UNPAID", "REFUNDED", "CANCELLED", "FAILED"],
        default: "UNPAID"
    },
    amount: {
        type: Number
    },
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    invoiceUrl: {
        type: String
    },
    paymentGatewayData: {
        type: Schema.Types.Mixed
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Payment = model<IPayment>("payment", paymentSchema);