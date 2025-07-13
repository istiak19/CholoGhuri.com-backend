import { authService } from './auth.service';
import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await authService.credentialsLogin(req.body);
    res.cookie("refreshToken", loginInfo.refreshToken, {
        httpOnly: true,
        secure: false
    });
    res.cookie("accessToken", loginInfo.accessToken, {
        httpOnly: true,
        secure: false
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successfully",
        data: loginInfo
    })
});
const refreshTokenLogin = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await authService.credentialsLoginRefresh(refreshToken as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successfully",
        data: tokenInfo
    })
});

export const authController = {
    credentialsLogin,
    refreshTokenLogin,
};