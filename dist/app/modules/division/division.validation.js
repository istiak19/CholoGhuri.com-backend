"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default.string({ required_error: "Name is required", }).min(1, "Name cannot be empty"),
    slug: zod_1.default.string({ required_error: "Slug is required", }).min(1, "Slug cannot be empty").optional(),
    thumbnail: zod_1.default.string().optional(),
    description: zod_1.default.string().optional()
});
exports.updatedDivisionZodSchema = zod_1.default.object({
    name: zod_1.default.string().optional(),
    slug: zod_1.default.string({ required_error: "Slug is required", }).min(1, "Slug cannot be empty").optional(),
    thumbnail: zod_1.default.string().optional(),
    description: zod_1.default.string().optional()
});
