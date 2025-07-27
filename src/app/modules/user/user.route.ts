import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest"
import { createUserZodSchema, updatedUserZodSchema } from "./user.validation";

const router = Router();

router.get("/all-user", checkAuth("ADMIN", "SUPER_ADMIN"), userControllers.allGetUser);
router.get("/get-me", checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), userControllers.GetUserMe);
router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);
router.get("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), userControllers.userSingleGet);
router.patch("/:id", validateRequest(updatedUserZodSchema), checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), userControllers.UpdateUser);

export const userRouters = router;