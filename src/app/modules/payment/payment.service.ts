/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { Payment } from "./payment.model";
import { AppError } from "../../errors/AppError";
import { Booking } from "../booking/booking.model";
import { SSLService } from '../SSLCommerz/SSLCommerz.service';
import { ISSLCommerz } from '../SSLCommerz/SSLCommerz.interface';
import { generateInvoicePDF, IInvoiceData } from '../../utils/invoice';
import { IUser } from '../user/user.interface';
import { ITour } from '../tour/tour.interface';
import { sendMail } from '../../utils/sendMail';
import { uploadInvoiceToCloudinary } from './../../config/cloudinary.config';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';

const getInvoicePayment = async (id: string, token: JwtPayload) => {
    
    const user = await User.findById(token.userId);

    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    };

    const payment = await Payment.findById(id).select("invoiceUrl");

    if (!payment) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment not found");
    };

    if (!payment.invoiceUrl) {
        throw new AppError(httpStatus.BAD_REQUEST, "No invoice found");
    };

    return payment.invoiceUrl;
};

const initPayment = async (id: string) => {
    const payment = await Payment.findOne({ bookingID: id });
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    };
    const booking = await Booking.findById(payment.bookingID)
    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhone = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phone: userPhone,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL
    }
};

const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: "PAID" },
            {
                new: true,
                runValidators: true,
                session
            }
        );
        const updatedBooking = await Booking.findByIdAndUpdate(updatedPayment?.bookingID,
            { status: "COMPLETE" },
            {
                runValidators: true,
                session
            }
        )
            .populate("tour", "title")
            .populate("user", "name email");

        if (!updatedBooking) {
            throw new AppError(httpStatus.BAD_REQUEST, "Booking not found");
        };

        if (!updatedPayment) {
            throw new AppError(httpStatus.BAD_REQUEST, "Payment not found");
        };

        const invoiceData: IInvoiceData = {
            customerName: (updatedBooking.user as unknown as IUser).name,
            tourName: (updatedBooking.tour as unknown as ITour).title,
            paymentId: updatedPayment?.transactionId ?? '',
            amount: updatedPayment?.amount,
            date: updatedBooking.createdAt as Date,
            guestCount: updatedBooking.guestCount,
        };

        const pdfBuffer = await generateInvoicePDF(invoiceData);
        const cloudinaryResult = await uploadInvoiceToCloudinary(pdfBuffer, "invoice");
        await Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult?.secure_url }, { runValidators: true, session });

        await sendMail({
            to: (updatedBooking.user as unknown as IUser).email,
            subject: "Your Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    content: pdfBuffer,
                    filename: "invoice.pdf",
                    contentType: "application/pdf"
                },
            ],
        });

        await session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Completed Successfully"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const failPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: "FAILED" },
            {
                new: true,
                runValidators: true,
                session
            }
        );
        await Booking.findByIdAndUpdate(updatedPayment?.bookingID,
            { status: "FAILED" },
            {
                runValidators: true,
                session
            }
        );

        await session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment Failed"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: "CANCELLED" },
            {
                new: true,
                runValidators: true,
                session
            }
        );
        await Booking.findByIdAndUpdate(updatedPayment?.bookingID,
            { status: "CANCELLED" },
            {
                runValidators: true,
                session
            }
        );

        await session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment Cancel"
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const paymentService = {
    getInvoicePayment,
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
};