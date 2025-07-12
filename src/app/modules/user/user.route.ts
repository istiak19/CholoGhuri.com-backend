import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { createUserZodSchema, updatedUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest"

const router = Router();

router.get("/all-user", checkAuth("ADMIN", "SUPER_ADMIN"), userControllers.allGetUser);
router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);
router.patch("/:id", validateRequest(updatedUserZodSchema), checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), userControllers.UpdateUser);

export const userRouter = router;