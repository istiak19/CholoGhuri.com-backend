import { authService } from './auth.service';
import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setCookies } from '../../utils/setCookies';
import { JwtPayload } from 'jsonwebtoken';

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await authService.credentialsLogin(req.body);
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // });
    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // });

    setCookies(res, loginInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: loginInfo
    })
});

const refreshTokenLogin = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await authService.credentialsLoginRefresh(refreshToken as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: tokenInfo
    })
});

const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged out successfully",
        data: null
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;
    await authService.resetNewPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        data: null
    });
});

export const authController = {
    credentialsLogin,
    refreshTokenLogin,
    logout,
    resetPassword
};