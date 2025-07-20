/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose"

export interface IPayment {
    booking: Types.ObjectId;
    transactionId: string,
    status: "PAID" | "UNPAID" | "REFUNDED" | "CANCELLED" | "FAILED";
    amount: number;
    paymentGatewayData?: any;
    invoiceUrl?: string
};