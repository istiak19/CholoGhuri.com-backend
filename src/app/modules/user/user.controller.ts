import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const allGetUser = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.userAllGetService();
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

const userSingleGet = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await userServices.userGetMeService(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User retrieved successfully",
        data: user
    });
});

const GetUserMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const user = await userServices.userGetMeService(decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile retrieved successfully",
        data: user
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
    const verifyTokenUser = req.user;
    const updateUser = await userServices.userUpdateService(id, info, verifyTokenUser as JwtPayload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User updated successfully",
        data: updateUser
    });
});

export const userControllers = {
    allGetUser,
    userSingleGet,
    GetUserMe,
    createUser,
    UpdateUser,
};