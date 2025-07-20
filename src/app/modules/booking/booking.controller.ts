import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from 'express';
import { bookingServices } from './booking.service';
import { JwtPayload } from 'jsonwebtoken';

const allGetBooking = catchAsync(async (req: Request, res: Response) => {
    const booking = await bookingServices.getBooking();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Bookings retrieved successfully",
        data: booking.booking,
        meta: {
            total: booking.totalBooking
        }
    });
});

const getMyBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const booking = await bookingServices.getMyBookings(decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Bookings retrieved successfully",
        data: booking.booking,
        meta: {
            total: booking.totalBooking
        }
    });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.bookingId;
    const singleBooking = await bookingServices.getSingleBookingService(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Single booking retrieved successfully",
        data: singleBooking
    });
});

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const booking = await bookingServices.createBookingService(req.body, decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Booking created successfully",
        data: booking
    });
});

export const bookingController = {
    allGetBooking,
    getMyBooking,
    getSingleBooking,
    createBooking,
};