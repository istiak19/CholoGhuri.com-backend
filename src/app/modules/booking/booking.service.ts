/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Booking } from './booking.model';
import { Payment } from '../payment/payment.model';
import { Tour } from '../tour/tour.model';
import { SSLService } from '../SSLCommerz/SSLCommerz.service';
import { ISSLCommerz } from '../SSLCommerz/SSLCommerz.interface';

const transactionGet = () => {
    // return 'txn_' + (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
    return `tnx_${Date.now()}_${Math.random() * 1000}`;
};

const createBookingService = async (payload: Partial<IBooking>, userID: string) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const transactionId = transactionGet();
        const user = await User.findById(userID);
        if (!user?.phone || !user?.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
        };
        const tour = await Tour.findById(payload.tour).select("costForm");
        if (!tour?.costForm) {
            throw new AppError(httpStatus.BAD_GATEWAY, "No tour cost found");
        };

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const amount = Number(tour.costForm) * Number(payload.guestCount!);

        const booking = await Booking.create([
            {
                user: userID,
                status: "PENDING",
                ...payload
            }
        ], { session });

        const payment = await Payment.create([
            {
                bookingID: booking[0]._id,
                status: 'UNPAID',
                transactionId,
                amount
            }
        ], { session });

        const updateBookingService = await Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, {
            new: true,
            runValidators: true,
            session
        }).populate("user", "name email phone address").populate("tour", "title costForm").populate("payment");

        // sent to SSL payment
        const userName = (updateBookingService?.user as any).name;
        const userAddress = (updateBookingService?.user as any).address;
        const userEmail = (updateBookingService?.user as any).email;
        const userPhone = (updateBookingService?.user as any).phone;
        const sslPayload: ISSLCommerz = {
            name: userName,
            email: userEmail,
            address: userAddress,
            phone: userPhone,
            amount: amount,
            transactionId
        }
        const SSLPayment = await SSLService.sslPaymentInit(sslPayload);
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return {
            booking: updateBookingService,
            paymentURL: SSLPayment.GatewayPageURL
        };
    } catch (error) {
        // ❌ Rollback
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const bookingServices = {
    createBookingService
};