"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGuideZodSchema = exports.createGuideZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createGuideZodSchema = zod_1.default.object({
    user: zod_1.default.string(),
    nidPhoto: zod_1.default.string(),
    division: zod_1.default.string()
});
exports.updateGuideZodSchema = zod_1.default.object({
    status: zod_1.default.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
});
