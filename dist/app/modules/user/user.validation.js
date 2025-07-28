"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default.string({
        required_error: "Name is required",
    }).min(1, "Name cannot be empty"),
    email: zod_1.default.string({
        required_error: "Email is required",
    }).email("Invalid email address"),
    password: zod_1.default
        .string({
        required_error: "Password is required",
    })
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phone: zod_1.default
        .string({
        required_error: "Phone number is required",
    })
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number").optional(),
    address: zod_1.default.string({
        required_error: "Address is required",
    }).optional(),
});
exports.updatedUserZodSchema = zod_1.default.object({
    name: zod_1.default.string({
        required_error: "Name is required",
    }).min(1, "Name cannot be empty").optional(),
    password: zod_1.default
        .string({
        required_error: "Password is required",
    })
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }).optional(),
    phone: zod_1.default
        .string({
        required_error: "Phone number is required",
    })
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number").optional(),
    role: zod_1.default.enum(["ADMIN", "USER", "SUPER_ADMIN", "GUIDE"]).optional(),
    isActive: zod_1.default
        .enum(["Active", "Inactive", "Blocked"]).optional(),
    isDeleted: zod_1.default
        .boolean({ invalid_type_error: "isDeleted must be true or false" }).optional(),
    isVerified: zod_1.default
        .boolean({ invalid_type_error: "isVerified must be true or false" }).optional(),
    address: zod_1.default.string({
        required_error: "Address is required",
    }).optional(),
});
