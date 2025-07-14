import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.refreshTokenLogin);
router.post("/logout", authController.logout);

export const authRouter = router;