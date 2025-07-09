import { Router } from "express";
import { userRouter } from "../modules/user/user.route";

export const router = Router();

const modulesRouter = [
    {
        path: "/user",
        route: userRouter
    }
];

modulesRouter.forEach((route) => {
    router.use(route.path, route.route)
});