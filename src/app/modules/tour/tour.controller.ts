import httpStatus from 'http-status';
import { Request, Response } from "express";
import { tourService } from "./tour.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ITour } from './tour.interface';

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
    const query = req.query;
    const tour = await tourService.getTourService(query as Record<string, string>);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Tour retrieved successfully",
        data: tour.tour,
        meta: {
            total: tour.metaData.total,
            page: tour.metaData.page,
            limit: tour.metaData.limit,
            totalPage: tour.metaData.totalPage
        }
    });
});

const createTour = catchAsync(async (req: Request, res: Response) => {
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    };

    const tour = await tourService.createTourService(payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour created successfully",
        data: tour
    });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    };
    const tour = await tourService.updateTourService(id, payload);
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