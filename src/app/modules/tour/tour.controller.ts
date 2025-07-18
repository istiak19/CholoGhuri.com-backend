import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tourService } from "./tour.service";
import sendResponse from "../../utils/sendResponse";

const getTourType = catchAsync(async (req: Request, res: Response) => {
    const tourType = await tourService.getTourTypeService();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour type retrieved successfully",
        data: tourType
    });
});

const createTourType = catchAsync(async (req: Request, res: Response) => {
    const tourType = await tourService.createTourTypeService(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour type created successfully",
        data: tourType
    });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const tourType = await tourService.updateTourTypeService(id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour type updated successfully",
        data: tourType
    });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const tourType = await tourService.deleteTourTypeService(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour type deleted successfully",
        data: tourType
    });
});

export const tourController = {
    getTourType,
    createTourType,
    updateTourType,
    deleteTourType
};