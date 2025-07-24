import { envVars } from './../../config/env.config';
import passport from "passport";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.refreshTokenLogin);
router.post("/logout", authController.logout);
router.post("/change-password", checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), authController.changePassword);
router.post("/set-password", checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), authController.setPassword);

// Frontend -> forget-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Fronted Link http://localhost:5173/reset-password?email=saminisrar1@gmail.com&token=token -> frontend e  query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> password hash -> save user password   
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), authController.resetPassword);


// Google login
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
});

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), authController.googleCallback);

export const authRouters = router;