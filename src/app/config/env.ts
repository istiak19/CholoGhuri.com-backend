import dotenv from "dotenv";
dotenv.config();

interface IEnv {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "development" | "production";
    JWT_SECRET: string,
    JWT_EXPIRES_IN: string,
    JWT_REFRESH_EXPIRES_IN: string,
    JWT_REFRESH_SECRET: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CLIENT_ID: string,
    FRONTEND_URL: string,
    EXPRESS_SESSION_SECRET: string,
    GOOGLE_CALLBACK_URL: string
};

const loadEnvVariable = (): IEnv => {
    const requiredVariable: string[] = ["PORT", "MONGO_URI", "NODE_ENV", "JWT_SECRET", "JWT_EXPIRES_IN", "JWT_REFRESH_EXPIRES_IN", "JWT_REFRESH_SECRET", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "FRONTEND_URL", "EXPRESS_SESSION_SECRET", "GOOGLE_CALLBACK_URL"];
    requiredVariable.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.MONGO_URI as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    };
};

export const envVars = loadEnvVariable();