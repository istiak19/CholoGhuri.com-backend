import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const getTourTypeService = async () => {
    const tourType = await TourType.find();
    return tourType;
};

const createTourTypeService = async (payload: ITourType) => {
    const isExistTourType = await TourType.findOne({ name: payload.name });
    if (isExistTourType) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour type already exists.")
    };
    const tourType = await TourType.create(payload);
    return tourType;
};

const updateTourTypeService = async (id: string, payload: Partial<ITourType>) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    const isExistTourType = await TourType.findOne({ name: payload.name, _id: { $ne: id } });
    if (isExistTourType) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour type already exists.")
    };
    const tourType = await TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return tourType;
};

const deleteTourTypeService = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    const isExistTourType = await Tour.findOne({ tourType: id });
    if (isExistTourType) {
        throw new AppError(httpStatus.BAD_REQUEST, "This tourType is associated with existing tours and cannot be deleted.")
    };
    const tourType = await TourType.findByIdAndDelete(id);
    return tourType;
};

const getTourService = async () => {
    const tour = await Tour.find();
    return tour;
};

const createTourService = async (payload: ITour) => {
    const isExistTour = await Tour.findOne({ title: payload.title });
    if (isExistTour) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour already exists.")
    };
    const slug = payload.title.toLocaleLowerCase().split(" ").join("-");
    payload.slug = slug;
    const tour = await Tour.create(payload);
    return tour;
};

const updateTourService = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found.");
    };
    const isExistTour = await Tour.findOne({ title: payload.title, _id: { $ne: id } });
    if (isExistTour) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour already exists.")
    };
    if (payload.title) {
        const slug = payload.title.toLocaleLowerCase().split(" ").join("-");
        payload.slug = slug;
    };
    const tour = await Tour.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return tour;
};

const deleteTourService = async (id: string) => {
    const existingTourType = await Tour.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    const tour = await Tour.findByIdAndDelete(id);
    return tour;
};

export const tourService = {
    getTourTypeService,
    createTourTypeService,
    updateTourTypeService,
    deleteTourTypeService,
    getTourService,
    createTourService,
    updateTourService,
    deleteTourService
};