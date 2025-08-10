import cors from "cors";
import "./app/config/passport";
import passport from "passport";
import { router } from "./app/router";
import session from "express-session";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env.config";
import notFound from "./app/middlewares/notFound";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.set("trust proxy", 1);
app.use(cors({
    origin: [
        envVars.FRONTEND_URL,
    ],
    credentials: true
}));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.send("CholoGhuri.com Backend API is running successfully!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;