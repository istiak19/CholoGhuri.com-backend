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
exports.seedSuperAdmin = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_config_1 = require("../config/env.config");
const user_model_1 = require("../modules/user/user.model");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({ email: env_config_1.envVars.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            // console.log("Super Admin already exist!");
            return;
        }
        ;
        const authProvider = {
            provider: "credentials",
            providerId: env_config_1.envVars.SUPER_ADMIN_EMAIL
        };
        const hashPassword = yield bcryptjs_1.default.hash(env_config_1.envVars.SUPER_ADMIN_PASSWORD, 10);
        const payload = {
            name: "Istiak Super Admin",
            email: env_config_1.envVars.SUPER_ADMIN_EMAIL,
            isVerified: true,
            role: "SUPER_ADMIN",
            password: hashPassword,
            auths: [authProvider]
        };
        yield user_model_1.User.create(payload);
    }
    catch (error) {
        // console.log(error)
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
