import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { divisionServices } from './division.service';
import { IDivision } from './division.interface';

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

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const division = await divisionServices.getSingleDivisionService(slug);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division retrieved successfully",
        data: division
    });
});

const createDivision = catchAsync(async (req: Request, res: Response) => {
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    };
    const division = await divisionServices.createDivisionService(payload);
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
    getSingleDivision,
    createDivision,
    updateDivision,
    deleteDivision
};