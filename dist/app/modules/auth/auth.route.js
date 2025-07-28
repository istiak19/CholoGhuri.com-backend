"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouters = void 0;
const env_config_1 = require("./../../config/env.config");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.authController.credentialsLogin);
router.post("/refresh-token", auth_controller_1.authController.refreshTokenLogin);
router.post("/logout", auth_controller_1.authController.logout);
router.post("/change-password", (0, checkAuth_1.checkAuth)("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), auth_controller_1.authController.changePassword);
router.post("/set-password", (0, checkAuth_1.checkAuth)("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), auth_controller_1.authController.setPassword);
// Frontend -> forget-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Fronted Link http://localhost:5173/reset-password?email=saminisrar1@gmail.com&token=token -> frontend e  query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> password hash -> save user password   
router.post("/forget-password", auth_controller_1.authController.forgetPassword);
router.post("/reset-password", (0, checkAuth_1.checkAuth)("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), auth_controller_1.authController.resetPassword);
// Google login
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", { scope: ["profile", "email"], state: redirect })(req, res, next);
}));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${env_config_1.envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), auth_controller_1.authController.googleCallback);
exports.authRouters = router;
