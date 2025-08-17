"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourTypeZodSchema = exports.createTourTypeZodSchema = exports.updatedTourZodSchema = exports.createTourZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createTourZodSchema = zod_1.default.object({
    title: zod_1.default.string({
        required_error: "Title is required",
    }).min(1, "Title cannot be empty"),
    slug: zod_1.default.string({
        required_error: "Slug is required",
    }).min(1, "Slug cannot be empty").optional(),
    images: zod_1.default.array(zod_1.default.string()).optional(),
    description: zod_1.default.string().optional(),
    location: zod_1.default.string().optional(),
    costForm: zod_1.default.number().optional(),
    departureLocation: zod_1.default.string(),
    arrivalLocation: zod_1.default.string(),
    startDate: zod_1.default.coerce.date().optional(),
    endDate: zod_1.default.coerce.date().optional(),
    included: zod_1.default.array(zod_1.default.string()).optional(),
    excluded: zod_1.default.array(zod_1.default.string()).optional(),
    amenities: zod_1.default.array(zod_1.default.string()).optional(),
    tourPlan: zod_1.default.array(zod_1.default.string()).optional(),
    maxGuest: zod_1.default.number().optional(),
    minAge: zod_1.default.number().optional(),
    tourType: zod_1.default.string(),
    division: zod_1.default.string(),
});
exports.updatedTourZodSchema = zod_1.default.object({
    title: zod_1.default.string({
        required_error: "Title is required",
    }).min(1, "Title cannot be empty").optional(),
    slug: zod_1.default.string({
        required_error: "Slug is required",
    }).min(1, "Slug cannot be empty").optional(),
    images: zod_1.default.array(zod_1.default.string()).optional(),
    description: zod_1.default.string().optional(),
    location: zod_1.default.string().optional(),
    costForm: zod_1.default.number().optional(),
    departureLocation: zod_1.default.string().optional(),
    arrivalLocation: zod_1.default.string().optional(),
    startDate: zod_1.default.coerce.date().optional(),
    endDate: zod_1.default.coerce.date().optional(),
    included: zod_1.default.array(zod_1.default.string()).optional(),
    excluded: zod_1.default.array(zod_1.default.string()).optional(),
    amenities: zod_1.default.array(zod_1.default.string()).optional(),
    tourPlan: zod_1.default.array(zod_1.default.string()).optional(),
    maxGuest: zod_1.default.number().optional(),
    minAge: zod_1.default.number().optional(),
    tourType: zod_1.default.string().optional(),
    division: zod_1.default.string().optional(),
    deleteImages: zod_1.default.array(zod_1.default.string()).optional()
});
exports.createTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default.string()
});
exports.updateTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default.string().optional()
});
