import dotenv from "dotenv";
dotenv.config();

interface IEnv {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "development" | "production";
    JWT_SECRET: string,
    JWT_EXPIRES_IN: string
};

const loadEnvVariable = (): IEnv => {
    const requiredVariable: string[] = ["PORT", "MONGO_URI", "NODE_ENV", "JWT_SECRET", "JWT_EXPIRES_IN"];
    requiredVariable.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.MONGO_URI as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string
    };
};

export const envVars = loadEnvVariable();