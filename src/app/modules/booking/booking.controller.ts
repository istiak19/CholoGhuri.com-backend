import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from 'express';
import { bookingServices } from './booking.service';
import { JwtPayload } from 'jsonwebtoken';

const allGetUser = catchAsync(async (req: Request, res: Response) => {
    // const result = await userServices.userAllGetService();
    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Users retrieved successfully",
    //     data: result.user,
    //     meta: {
    //         total: result.totalUser
    //     }
    // });
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

const UpdateUser = catchAsync(async (req: Request, res: Response) => {
    // const id = req.params.id;
    // const info = req.body;
    // const verifyTokenUser = req.user;
    // const updateUser = await userServices.userUpdateService(id, info, verifyTokenUser as JwtPayload);
    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.CREATED,
    //     message: "User updated successfully",
    //     data: updateUser
    // });
});

export const bookingController = {
    allGetUser,
    createBooking,
    UpdateUser,
};