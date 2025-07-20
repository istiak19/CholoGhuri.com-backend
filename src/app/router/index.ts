import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.route";
import { tourRouter } from "../modules/tour/tour.route";
import { divisionRouter } from "../modules/division/division.route";
import { bookingRoute } from "../modules/booking/booking.route";

export const router = Router();

const modulesRouter = [
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/division",
        route: divisionRouter
    },
    {
        path: "/tour",
        route: tourRouter
    },
    {
        path: "/booking",
        route: bookingRoute
    },
];

modulesRouter.forEach((route) => {
    router.use(route.path, route.route)
});