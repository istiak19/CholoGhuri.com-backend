import passport from "passport";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.refreshTokenLogin);
router.post("/logout", authController.logout);
router.post("/reset-password", checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), authController.resetPassword);

// Google login
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
});

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), authController.googleCallback);

export const authRouters = router;