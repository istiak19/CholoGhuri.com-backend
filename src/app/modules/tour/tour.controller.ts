import httpStatus from 'http-status';
import { Request, Response } from "express";
import { tourService } from "./tour.service";
import { catchAsync } from "../../utils/catchAsync";
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

const getTour = catchAsync(async (req: Request, res: Response) => {
    const tour = await tourService.getTourService();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour retrieved successfully",
        data: tour
    });
});

const createTour = catchAsync(async (req: Request, res: Response) => {
    const tour = await tourService.createTourService(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour created successfully",
        data: tour
    });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const tour = await tourService.updateTourService(id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour updated successfully",
        data: tour
    });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const tour = await tourService.deleteTourService(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour deleted successfully",
        data: tour
    });
});

export const tourController = {
    getTourType,
    createTourType,
    updateTourType,
    deleteTourType,
    getTour,
    createTour,
    updateTour,
    deleteTour
};