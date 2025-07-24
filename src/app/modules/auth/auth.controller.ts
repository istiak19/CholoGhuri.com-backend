/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env.config';
import { authService } from './auth.service';
import { AppError } from '../../errors/AppError';
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setCookies } from '../../utils/setCookies';
import { NextFunction, Request, Response } from "express";
import { userCreateToken } from '../../utils/createUserToken';

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authService.credentialsLogin(req.body);
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // });
    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // });

    // setCookies(res, loginInfo);

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "User logged in successfully",
    //     data: loginInfo
    // })

    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(401, err));
        };

        if (!user) {
            return next(new AppError(401, info.message))
        };

        const userTokens = await userCreateToken(user);
        setCookies(res, userTokens);
        const { password, ...rest } = user.toObject();
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged in successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        });
    })(req, res, next);
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

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;
    await authService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        data: null
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { id, newPassword } = req.body;
    const decodedToken = req.user;
    await authService.resetNewPassword(id, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        data: null
    });
});

const setPassword = catchAsync(async (req: Request, res: Response) => {
    const { password } = req.body;
    const decodedToken = req.user as JwtPayload;
    const result = await authService.setPassword(decodedToken.userId, password);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password set password successfully",
        data: result
    });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.forgetPassword(email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email sent successfully",
        data: null
    });
});

const googleCallback = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    let redirect = req.query.state ? String(req.query.state) : "";
    if (redirect.startsWith("/")) {
        redirect = redirect.slice(1);
    };

    // console.log(user)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = userCreateToken(user);
    setCookies(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirect}`);
});

export const authController = {
    credentialsLogin,
    refreshTokenLogin,
    logout,
    resetPassword,
    changePassword,
    setPassword,
    forgetPassword,
    googleCallback
};