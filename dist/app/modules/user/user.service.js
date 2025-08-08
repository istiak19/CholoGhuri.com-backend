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
exports.userServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const userAllGetService = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find().select("-password");
    const totalUser = yield user_model_1.User.countDocuments();
    return {
        user,
        totalUser
    };
});
const userSingleGetService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return user;
});
const userGetMeService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return user;
});
const userCreateService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    // const isExist = await User.findOne({ email });
    // if (isExist) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
    // };
    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
    const auth = {
        provider: "credentials",
        providerId: email
    };
    const createdUser = yield user_model_1.User.create(Object.assign({ email, password: hashPassword, auths: [auth] }, rest));
    const user = yield user_model_1.User.findById(createdUser._id).select("-password");
    return user;
});
const userUpdateService = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === "USER" || decodedToken.role === "GUIDE") {
        if (decodedToken.userId !== userId) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not unauthorized");
        }
        ;
    }
    ;
    const isExistUser = yield user_model_1.User.findById(userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    if (decodedToken.role === "ADMIN" && isExistUser.role === "SUPER_ADMIN") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Only SUPER_ADMIN can assign this role");
    }
    ;
    if (payload.role) {
        if (decodedToken.role === "USER" || decodedToken.role === "GUIDE") {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Unauthorized access to change role");
        }
        ;
    }
    ;
    // if (payload.role === "SUPER_ADMIN" && decodedToken.role === "ADMIN") {
    //     throw new AppError(httpStatus.FORBIDDEN, "Only SUPER_ADMIN can assign this role");
    // };
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === "USER" || decodedToken.role === "GUIDE") {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Unauthorized access to modify user status");
        }
        ;
    }
    ;
    const userUpdated = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return userUpdated;
});
exports.userServices = {
    userAllGetService,
    userSingleGetService,
    userGetMeService,
    userCreateService,
    userUpdateService
};
