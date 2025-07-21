import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Booking } from './booking.model';
import { Payment } from '../payment/payment.model';
import { Tour } from '../tour/tour.model';
import { SSLService } from '../SSLCommerz/SSLCommerz.service';

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

const transactionGet = () => {
    // return 'txn_' + (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
    return `tnx_${Date.now()}_${Math.random() * 1000}`;
};

const createBookingService = async (payload: Partial<IBooking>, userID: string) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
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
                booking: booking[0]._id,
                status: 'UNPAID',
                transactionId: transactionGet(),
                amount
            }
        ], { session });

        const updateBookingService = await Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, {
            new: true,
            runValidators: true,
            session
        }).populate("user", "name email phone address").populate("tour", "title costForm").populate("payment");

        // sent to SSL payment
        // const SSLPayment=await SSLService.sslPaymentInit({
            
        // })
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return updateBookingService;
    } catch (error) {
        // ❌ Rollback
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const bookingServices = {
    getBooking,
    getMyBookings,
    getSingleBookingService,
    createBookingService
};