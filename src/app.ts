import cors from "cors";
import passport from "passport";
import { router } from "./app/router";
import "./app/config/passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import notFound from "./app/middlewares/notFound";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true
}));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.send("PH Tour Management System Backend API is running successfully!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;