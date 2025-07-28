"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    bookingID: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.Mixed
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Payment = (0, mongoose_1.model)("payment", paymentSchema);
