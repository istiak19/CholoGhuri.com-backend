import { Payment } from "./payment.model";
import { Booking } from "../booking/booking.model";

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
    cancelPayment
};