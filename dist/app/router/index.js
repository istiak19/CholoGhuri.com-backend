"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const tour_route_1 = require("../modules/tour/tour.route");
const booking_route_1 = require("../modules/booking/booking.route");
const payment_route_1 = require("../modules/payment/payment.route");
const division_route_1 = require("../modules/division/division.route");
const otp_route_1 = require("../modules/otp/otp.route");
const statistics_route_1 = require("../modules/statistics/statistics.route");
exports.router = (0, express_1.Router)();
const modulesRouter = [
    {
        path: "/user",
        route: user_route_1.userRouters
    },
    {
        path: "/auth",
        route: auth_route_1.authRouters
    },
    {
        path: "/division",
        route: division_route_1.divisionRouters
    },
    {
        path: "/tour",
        route: tour_route_1.tourRouters
    },
    {
        path: "/booking",
        route: booking_route_1.bookingRoutes
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRoutes
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes
    },
    {
        path: "/statistics",
        route: statistics_route_1.statisticsRoutes
    },
];
modulesRouter.forEach((route) => {
    exports.router.use(route.path, route.route);
});
