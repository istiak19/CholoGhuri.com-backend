import httpStatus from 'http-status';
import { envVars } from '../../config/env';
import { Request, Response } from "express";
import { paymentService } from './payment.service';
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";


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
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
};