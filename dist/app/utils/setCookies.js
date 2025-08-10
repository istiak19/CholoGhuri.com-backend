"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
;
const setCookies = (res, token) => {
    if (token.accessToken) {
        res.cookie("accessToken", token.accessToken, {
            httpOnly: true,
            // secure: envVars.NODE_ENV === "production",
            secure: true,
            sameSite: "none"
        });
    }
    if (token.refreshToken) {
        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            // secure: envVars.NODE_ENV === "production",
            secure: true,
            sameSite: "none"
        });
    }
};
exports.setCookies = setCookies;
