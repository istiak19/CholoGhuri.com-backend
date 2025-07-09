/* eslint-disable no-console */
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import { AppError } from "../../errors/AppError";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        throw new AppError(httpStatus.BAD_REQUEST, "fake")
        const user = await userServices.userCreateService(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (err) {
        console.error("Error creating user:", err);
        next(err)
        // res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        //     success: false,
        //     message: "Something went wrong while creating the user",
        // });
    }
};

export const userControllers = {
    createUser,
};