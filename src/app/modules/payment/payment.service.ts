/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { Payment } from "./payment.model";
import { Booking } from "../booking/booking.model";
import { AppError } from "../../errors/AppError";
import { SSLService } from '../SSLCommerz/SSLCommerz.service';
import { ISSLCommerz } from '../SSLCommerz/SSLCommerz.interface';

const initPayment = async (id: string) => {
    const payment = await Payment.findOne({ bookingID: id });
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    };
    const booking = await Booking.findById(payment.bookingID)
    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhone = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phone: userPhone,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL
    }
};

const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: "PAID" },
            {
                new: true,
                runValidators: true,
                session
            }
        );
        await Booking.findByIdAndUpdate(updatedPayment?.bookingID,
            { status: "COMPLETE" },
            {
                runValidators: true,
                session
            }
        );

        await session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Completed Successfully"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const failPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: "FAILED" },
            {
                new: true,
                runValidators: true,
                session
            }
        );
        await Booking.findByIdAndUpdate(updatedPayment?.bookingID,
            { status: "FAILED" },
            {
                runValidators: true,
                session
            }
        );

        await session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment Failed"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: "CANCELLED" },
            {
                new: true,
                runValidators: true,
                session
            }
        );
        await Booking.findByIdAndUpdate(updatedPayment?.bookingID,
            { status: "CANCELLED" },
            {
                runValidators: true,
                session
            }
        );

        await session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment Cancel"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const paymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
};