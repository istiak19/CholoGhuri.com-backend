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
exports.bookingServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const booking_model_1 = require("./booking.model");
const tour_model_1 = require("../tour/tour.model");
const AppError_1 = require("../../errors/AppError");
const payment_model_1 = require("../payment/payment.model");
const SSLCommerz_service_1 = require("../SSLCommerz/SSLCommerz.service");
const transactionGet_1 = require("../../utils/transactionGet");
const getBooking = () => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.find()
        .populate("user", { _id: 0, name: 1, email: 1 })
        .populate("tour", { title: 1, costForm: 1, _id: 0 })
        .populate("payment", { _id: 0 });
    const totalBooking = yield booking_model_1.Booking.countDocuments();
    return {
        booking,
        totalBooking
    };
});
const getMyBookings = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.find({ user: userID }).populate("user", { _id: 0, name: 1, email: 1 })
        .populate("tour", { title: 1, costForm: 1, _id: 0 })
        .populate("payment", { _id: 0, amount: 1, createdAt: 1, status: 1 });
    const totalBooking = yield booking_model_1.Booking.countDocuments({ user: userID });
    return {
        booking,
        totalBooking
    };
});
const getSingleBookingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findOne({ _id: id }).populate("user", { _id: 0, name: 1, email: 1 })
        .populate("tour", { title: 1, costForm: 1, _id: 0 })
        .populate("payment", { _id: 0, amount: 1, createdAt: 1, status: 1 });
    return booking;
});
const createBookingService = (payload, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const transactionId = (0, transactionGet_1.transactionGet)();
        const user = yield user_model_1.User.findById(userID);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Please Update Your Profile to Book a Tour.");
        }
        ;
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costForm");
        if (!(tour === null || tour === void 0 ? void 0 : tour.costForm)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_GATEWAY, "No tour cost found");
        }
        ;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const amount = Number(tour.costForm) * Number(payload.guestCount);
        const booking = yield booking_model_1.Booking.create([
            Object.assign({ user: userID, status: "PENDING" }, payload)
        ], { session });
        if (!booking || !booking.length || !booking[0]._id) {
            throw new AppError_1.AppError(400, "Booking ID is missing or invalid.");
        }
        const payment = yield payment_model_1.Payment.create([
            {
                bookingID: booking[0]._id,
                status: "UNPAID",
                transactionId,
                amount,
            },
        ], { session });
        const updateBookingService = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, {
            new: true,
            runValidators: true,
            session
        }).populate("user", "name email phone address").populate("tour", "title costForm").populate("payment");
        // sent to SSL payment
        const userName = (updateBookingService === null || updateBookingService === void 0 ? void 0 : updateBookingService.user).name;
        const userAddress = (updateBookingService === null || updateBookingService === void 0 ? void 0 : updateBookingService.user).address;
        const userEmail = (updateBookingService === null || updateBookingService === void 0 ? void 0 : updateBookingService.user).email;
        const userPhone = (updateBookingService === null || updateBookingService === void 0 ? void 0 : updateBookingService.user).phone;
        const sslPayload = {
            name: userName,
            amount: amount,
            email: userEmail,
            phone: userPhone,
            transactionId,
            address: userAddress,
        };
        const SSLPayment = yield SSLCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            booking: updateBookingService,
            paymentURL: SSLPayment.GatewayPageURL
        };
    }
    catch (error) {
        // ❌ Rollback
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateBookingService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistBooking = yield booking_model_1.Booking.findById(id);
    if (!isExistBooking) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Booking not found.");
    }
    ;
    const updateBooking = yield booking_model_1.Booking.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return updateBooking;
});
exports.bookingServices = {
    getBooking,
    getMyBookings,
    getSingleBookingService,
    createBookingService,
    updateBookingService
};
