import httpStatus from "http-status";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
// import { verifyToken } from "../../utils/jwt";
// import { envVars } from "../../config/env";
// import { JwtPayload } from "jsonwebtoken";

const allGetUser = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.userAllGetService();
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "Users retrieved successfully",
    //     data: result.user,
    // });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: result.user,
        meta: {
            total: result.totalUser
        }
    });
});

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

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userServices.userCreateService(req.body);
    // res.status(httpStatus.CREATED).json({
    //     success: true,
    //     message: "User created successfully",
    //     data: user,
    // });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: user
    });
});
const UpdateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const info = req.body;
    // const token = req.headers.authorization;
    // const verifyTokenUser = verifyToken(token as string, envVars.JWT_SECRET) as JwtPayload;
    const verifyTokenUser = req.user;
    const updateUser = await userServices.userUpdateService(id, info, verifyTokenUser);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: updateUser
    });
});

export const userControllers = {
    allGetUser,
    createUser,
    UpdateUser,
};