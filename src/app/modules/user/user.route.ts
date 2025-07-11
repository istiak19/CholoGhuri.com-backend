import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.get("/all-user", userControllers.allGetUser);
router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);

export const userRouter = router;