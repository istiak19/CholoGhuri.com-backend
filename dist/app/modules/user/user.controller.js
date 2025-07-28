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
exports.userControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const allGetUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.userAllGetService();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Users retrieved successfully",
        data: result.user,
        meta: {
            total: result.totalUser
        }
    });
}));
const userSingleGet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_service_1.userServices.userGetMeService(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User retrieved successfully",
        data: user
    });
}));
const GetUserMe = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const user = yield user_service_1.userServices.userGetMeService(decodedToken.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User retrieved successfully",
        data: user
    });
}));
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // throw new AppError(httpStatus.BAD_REQUEST, "fake")
//         const user = await userServices.userCreateService(req.body);
//         res.status(httpStatus.CREATED).json({
//             success: true,
//             message: "User created successfully",
//             data: user,
//         });
//     } catch (err) {
//         console.error("Error creating user:", err);
//         next(err)
//         // res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         //     success: false,
//         //     message: "Something went wrong while creating the user",
//         // });
//     }
// };
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.userCreateService(req.body);
    // res.status(httpStatus.CREATED).json({
    //     success: true,
    //     message: "User created successfully",
    //     data: user,
    // });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "User created successfully",
        data: user
    });
}));
const UpdateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const info = req.body;
    const verifyTokenUser = req.user;
    const updateUser = yield user_service_1.userServices.userUpdateService(id, info, verifyTokenUser);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User updated successfully",
        data: updateUser
    });
}));
exports.userControllers = {
    allGetUser,
    userSingleGet,
    GetUserMe,
    createUser,
    UpdateUser,
};
