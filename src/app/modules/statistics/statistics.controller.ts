import httpStatus from 'http-status';
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { statisticsService } from './statistics.service';

const getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await statisticsService.getUser();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User statistics fetched successfully",
        data: user
    });
});

const getBooking = catchAsync(async (req: Request, res: Response) => {
    const booking = await statisticsService.getBooking();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking statistics fetched successfully",
        data: booking
    });
});

const getPayment = catchAsync(async (req: Request, res: Response) => {
    const payment = await statisticsService.getPayment();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment statistics fetched successfully",
        data: payment
    });
});

const getTour = catchAsync(async (req: Request, res: Response) => {
    const tour = await statisticsService.getTour();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour statistics fetched successfully",
        data: tour
    });
});


export const statisticsController = {
    getUser,
    getTour,
    getBooking,
    getPayment,
};