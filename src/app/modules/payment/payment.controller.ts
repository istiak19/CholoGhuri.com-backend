import httpStatus from 'http-status';
import { envVars } from '../../config/env.config';
import { Request, Response } from "express";
import { paymentService } from './payment.service';
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from 'jsonwebtoken';


const getInvoicePayment = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const decodedToken = req.user as JwtPayload;
    const result = await paymentService.getInvoicePayment(id,decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment invoice retrieved successfully.",
        data: result
    });
});

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.bookingID;
    const result = await paymentService.initPayment(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment done successfully",
        data: result
    });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await paymentService.successPayment(query as Record<string, string>);
    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`)
    };
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await paymentService.failPayment(query as Record<string, string>);
    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`)
    };
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await paymentService.cancelPayment(query as Record<string, string>);
    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`)
    };
});

export const paymentController = {
    getInvoicePayment,
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
};