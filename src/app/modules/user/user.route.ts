import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest"

const router = Router();

router.get("/all-user", checkAuth("ADMIN", "SUPER_ADMIN"), userControllers.allGetUser);
router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);

export const userRouter = router;