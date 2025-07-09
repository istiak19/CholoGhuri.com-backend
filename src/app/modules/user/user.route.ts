import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/all-user", userControllers.allGetUser);
router.post("/register", userControllers.createUser);

export const userRouter=router;