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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const port = process.env.PORT;
let server;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB!");
            server = app_1.default.listen(port, () => {
                console.log(`Server is running at http://localhost:${port}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
;
startServer();
process.on("SIGINT", () => {
    console.warn("💥SIGINT received. Gracefully shutting down...");
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
process.on("unhandledRejection", (err) => {
    console.error("🚨Unhandled Promise Rejection detected. Shutting down the server...");
    console.error("Error details:", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Promise.reject(new Error("I forgot to catch this promise"));
process.on("uncaughtException", (err) => {
    console.error("💥Uncaught Exception detected. Shutting down the server...");
    console.error("Error details:", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// throw new Error("I forgot to handle this local error");
