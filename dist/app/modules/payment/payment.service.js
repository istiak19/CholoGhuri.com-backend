"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const payment_model_1 = require("./payment.model");
const AppError_1 = require("../../errors/AppError");
const booking_model_1 = require("../booking/booking.model");
const SSLCommerz_service_1 = require("../SSLCommerz/SSLCommerz.service");
const invoice_1 = require("../../utils/invoice");
const sendMail_1 = require("../../utils/sendMail");
const cloudinary_config_1 = require("./../../config/cloudinary.config");
const user_model_1 = require("../user/user.model");
const getInvoicePayment = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(token.userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "User not found");
    }
    ;
    const payment = yield payment_model_1.Payment.findById(id).select("invoiceUrl");
    if (!payment) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Payment not found");
    }
    ;
    if (!payment.invoiceUrl) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "No invoice found");
    }
    ;
    return payment.invoiceUrl;
});
const initPayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ bookingID: id });
    if (!payment) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    }
    ;
    const booking = yield booking_model_1.Booking.findById(payment.bookingID);
    const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const userPhone = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    const sslPayload = {
        address: userAddress,
        email: userEmail,
        phone: userPhone,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };
    const sslPayment = yield SSLCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: "PAID" }, {
            new: true,
            runValidators: true,
            session
        });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.bookingID, { status: "COMPLETE" }, {
            runValidators: true,
            session
        })
            .populate("tour", "title")
            .populate("user", "name email");
        if (!updatedBooking) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Booking not found");
        }
        ;
        if (!updatedPayment) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Payment not found");
        }
        ;
        const invoiceData = {
            customerName: updatedBooking.user.name,
            tourName: updatedBooking.tour.title,
            paymentId: (_a = updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.transactionId) !== null && _a !== void 0 ? _a : '',
            amount: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.amount,
            date: updatedBooking.createdAt,
            guestCount: updatedBooking.guestCount,
        };
        const pdfBuffer = yield (0, invoice_1.generateInvoicePDF)(invoiceData);
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadInvoiceToCloudinary)(pdfBuffer, "invoice");
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.secure_url }, { runValidators: true, session });
        yield (0, sendMail_1.sendMail)({
            to: updatedBooking.user.email,
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
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Completed Successfully"
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: "FAILED" }, {
            new: true,
            runValidators: true,
            session
        });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.bookingID, { status: "FAILED" }, {
            runValidators: true,
            session
        });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment Failed"
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: "CANCELLED" }, {
            new: true,
            runValidators: true,
            session
        });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.bookingID, { status: "CANCELLED" }, {
            runValidators: true,
            session
        });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment Cancel"
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.paymentService = {
    getInvoicePayment,
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
};
