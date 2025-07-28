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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const sendMail_1 = require("../../utils/sendMail");
const AppError_1 = require("../../errors/AppError");
const env_config_1 = require("../../config/env.config");
const createUserToken_1 = require("../../utils/createUserToken");
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isExist = yield user_model_1.User.findOne({ email });
    if (!isExist) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    ;
    const isMatchPassword = yield bcryptjs_1.default.compare(password, isExist.password);
    if (!isMatchPassword) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Incorrect password");
    }
    ;
    // const jwtPayload = {
    //     userId: isExist._id,
    //     email: isExist.email,
    //     role: isExist.role
    // };
    // const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN);
    // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES_IN);
    const token = (0, createUserToken_1.userCreateToken)(isExist);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = isExist.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: rest
    };
});
const credentialsLoginRefresh = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, createUserToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "The current password you entered is incorrect");
    }
    ;
    user.password = yield bcryptjs_1.default.hash(newPassword, 10);
    yield user.save();
});
const resetNewPassword = (id, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (id !== decodedToken.userId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You can't reset password");
    }
    ;
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "User dose not found");
    }
    ;
    user.password = yield bcryptjs_1.default.hash(newPassword, 10);
    yield user.save();
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    if (user.password && user.auths.some(providerObjects => providerObjects.provider === "google")) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings.");
    }
    ;
    const hashPassword = yield bcryptjs_1.default.hash(plainPassword, 10);
    const credentialProvider = {
        provider: "credentials",
        providerId: user.email
    };
    const auths = [...user.auths, credentialProvider];
    user.auths = auths;
    user.password = hashPassword;
    yield user.save();
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findOne({ email });
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    ;
    if (!isExistUser.isVerified) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User is not verified");
    }
    ;
    if (isExistUser.isActive === "Blocked" || isExistUser.isActive === "Inactive") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `User is ${isExistUser.isActive}`);
    }
    ;
    if (isExistUser.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User is deleted");
    }
    ;
    const payload = {
        userId: isExistUser._id,
        email: isExistUser.email,
        role: isExistUser.role
    };
    const resetToken = jsonwebtoken_1.default.sign(payload, env_config_1.envVars.JWT_SECRET, {
        expiresIn: "10m"
    });
    const resetUILink = `${env_config_1.envVars.FRONTEND_URL}/reset-password?id=${isExistUser._id}&token=${resetToken}`;
    (0, sendMail_1.sendMail)({
        to: isExistUser.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isExistUser.name,
            resetUILink
        }
    });
});
exports.authService = {
    credentialsLogin,
    credentialsLoginRefresh,
    changePassword,
    setPassword,
    forgetPassword,
    resetNewPassword,
};
