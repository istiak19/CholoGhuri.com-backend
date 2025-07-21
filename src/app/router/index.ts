import { Router } from "express";
import { userRouters } from "../modules/user/user.route";
import { authRouters } from "../modules/auth/auth.route";
import { tourRouters } from "../modules/tour/tour.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { divisionRouters } from "../modules/division/division.route";

export const router = Router();

const modulesRouter = [
    {
        path: "/user",
        route: userRouters
    },
    {
        path: "/auth",
        route: authRouters
    },
    {
        path: "/division",
        route: divisionRouters
    },
    {
        path: "/tour",
        route: tourRouters
    },
    {
        path: "/booking",
        route: bookingRoutes
    },
    {
        path: "/payment",
        route: paymentRoutes
    },
];

modulesRouter.forEach((route) => {
    router.use(route.path, route.route)
});