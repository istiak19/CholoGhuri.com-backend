import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { ITourType } from "./tour.interface";
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

export const tourService = {
    getTourTypeService,
    createTourTypeService,
    updateTourTypeService,
    deleteTourTypeService
};