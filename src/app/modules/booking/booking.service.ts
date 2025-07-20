import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Booking } from './booking.model';
import { Payment } from '../payment/payment.model';
import { Tour } from '../tour/tour.model';

const transactionGet = () => {
    // return 'txn_' + (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
    return `tnx_${Date.now()}_${Math.random() * 1000}`;
};

const createBookingService = async (payload: Partial<IBooking>, userID: string) => {
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

    const booking = await Booking.create({
        user: userID,
        status: "PENDING",
        ...payload
    });

    const payment = await Payment.create({
        booking: booking._id,
        status: 'UNPAID',
        transactionId: transactionGet(),
        amount
    });

    const updateBookingService = await Booking.findByIdAndUpdate(booking._id, { payment: payment._id }, {
        new: true,
        runValidators: true
    }).populate("user", "name email phone address").populate("tour", "title costForm").populate("payment");

    return updateBookingService;
};

export const bookingServices = {
    createBookingService
};