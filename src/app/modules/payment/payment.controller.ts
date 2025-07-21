import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from './payment.service';
import { envVars } from '../../config/env';

const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await paymentService.successPayment(query as Record<string, string>);
    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`)
    };
});

// const failPayment = catchAsync(async (req: Request, res: Response) => {

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Division deleted successfully",
//         data: 
//     });
// });

// const cancelPayment = catchAsync(async (req: Request, res: Response) => {

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Division deleted successfully",
//         data: 
//     });
// });

export const paymentController = {
    successPayment,
    // failPayment,
    // cancelPayment
};