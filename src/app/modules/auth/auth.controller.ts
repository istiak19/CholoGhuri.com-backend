import { authService } from './auth.service';
import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await authService.credentialsLogin(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successfully",
        data: loginInfo
    })
});

export const authController = {
    credentialsLogin
};