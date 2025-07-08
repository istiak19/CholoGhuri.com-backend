import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true
}));

app.get("/", (req: Request, res: Response) => {
    res.send("PH Tour Management System Backend API is running successfully!");
});

export default app;