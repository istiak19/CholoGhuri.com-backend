import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { otpService } from './otp.service';

const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body
    const result = await otpService.sendOTP(email);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP sent successfully",
        data: result
    });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await otpService.verifyOTP(email, otp);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP verify successfully",
        data: result
    });
});

export const otpController = {
    sendOTP,
    verifyOTP
};