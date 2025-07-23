/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { User } from "../user/user.model";
import { Booking } from './booking.model';
import { Tour } from '../tour/tour.model';
import { IBooking } from "./booking.interface";
import { AppError } from "../../errors/AppError";
import { Payment } from '../payment/payment.model';
import { SSLService } from '../SSLCommerz/SSLCommerz.service';
import { ISSLCommerz } from '../SSLCommerz/SSLCommerz.interface';
import { transactionGet } from '../../utils/transactionGet';

const getBooking = async () => {
    const booking = await Booking.find()
        .populate("user", { _id: 0, name: 1, email: 1 })
        .populate("tour", { title: 1, costForm: 1, _id: 0 })
        .populate("payment", { _id: 0 });
    const totalBooking = await Booking.countDocuments();
    return {
        booking,
        totalBooking
    };
};

const getMyBookings = async (userID: string) => {
    const booking = await Booking.find({ user: userID }).populate("user", { _id: 0, name: 1, email: 1 })
        .populate("tour", { title: 1, costForm: 1, _id: 0 })
        .populate("payment", { _id: 0, amount: 1, createdAt: 1, status: 1 });
    const totalBooking = await Booking.countDocuments({ user: userID });
    return {
        booking,
        totalBooking
    };
};

const getSingleBookingService = async (id: string) => {
    const booking = await Booking.findOne({ _id: id }).populate("user", { _id: 0, name: 1, email: 1 })
        .populate("tour", { title: 1, costForm: 1, _id: 0 })
        .populate("payment", { _id: 0, amount: 1, createdAt: 1, status: 1 });
    return booking;
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
            amount: amount,
            email: userEmail,
            phone: userPhone,
            transactionId,
            address: userAddress,
        };
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

const updateBookingService = async (id: string, payload: Partial<IBooking>) => {
    const isExistBooking = await Booking.findById(id);
    if (!isExistBooking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found.")
    };

    const updateBooking = await Booking.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return updateBooking;
};

export const bookingServices = {
    getBooking,
    getMyBookings,
    getSingleBookingService,
    createBookingService,
    updateBookingService
};