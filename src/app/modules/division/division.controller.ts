import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { divisionServices } from './division.service';

const getDivision = catchAsync(async (req: Request, res: Response) => {
    const division = await divisionServices.getDivisionService();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division retrieved successfully",
        data: division.division,
        meta: {
            total: division.totalDivision
        }
    });
});

const createDivision = catchAsync(async (req: Request, res: Response) => {
    const division = await divisionServices.createDivisionService(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Division created successfully",
        data: division
    });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const division = await divisionServices.updateDivisionService(id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division updated successfully",
        data: division
    });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const division = await divisionServices.deleteDivisionService(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division deleted successfully",
        data: division
    });
});

export const divisionController = {
    getDivision,
    createDivision,
    updateDivision,
    deleteDivision
};