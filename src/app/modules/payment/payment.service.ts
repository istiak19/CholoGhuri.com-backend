import { Booking } from "../booking/booking.model";
import { IPayment } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();

    let paymentStatus: IPayment["status"] = "UNPAID";
    if (query.status === "success") {
        paymentStatus = "PAID";
    } else if (query.status === "cancel") {
        paymentStatus = "CANCELLED";
    } else if (query.status === "fail") {
        paymentStatus = "FAILED";
    }

    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: paymentStatus },
            {
                new: true,
                runValidators: true,
                session
            }
        );
        await Booking.findByIdAndUpdate(updatedPayment?.bookingID,
            { status: "COMPLETE" },
            {
                new: true,
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
        // console.error("❌ Payment update error:", error);
        throw error;
    }
};
// const failPayment = async () => { };
// const cancelPayment = async () => { };

export const paymentService = {
    successPayment,
    // failPayment,
    // cancelPayment
};