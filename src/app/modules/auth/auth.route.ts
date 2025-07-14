import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.refreshTokenLogin);
router.post("/logout", authController.logout);
router.post("/reset-password", checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), authController.resetPassword);

export const authRouter = router;