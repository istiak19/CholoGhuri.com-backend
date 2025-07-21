/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose"

export interface IPayment {
    bookingID: Types.ObjectId;
    transactionId: string,
    status: "PAID" | "UNPAID" | "REFUNDED" | "CANCELLED" | "FAILED";
    amount: number;
    paymentGatewayData?: any;
    invoiceUrl?: string
};