import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.route";
import { divisionRouter } from "../modules/division/division.route";

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
    }
];

modulesRouter.forEach((route) => {
    router.use(route.path, route.route)
});