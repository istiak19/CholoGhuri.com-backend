import httpStatus from 'http-status';
import { Tour } from "../tour/tour.model";
import { Division } from "./division.model";
import { AppError } from "../../errors/AppError";
import { IDivision } from "./division.interface";
import { deleteImageFromCLoudinary } from '../../config/cloudinary.config';

const getDivisionService = async () => {
    const division = await Division.find();
    const totalDivision = await Division.countDocuments();
    return {
        division,
        totalDivision
    };
};

const getSingleDivisionService = async (slug: string) => {
    const division = await Division.findOne({ slug });
    return division
};

const createDivisionService = async (payload: IDivision) => {
    const isExistDivision = await Division.findOne({ name: payload.name });
    if (isExistDivision) {
        throw new AppError(httpStatus.BAD_REQUEST, "This division name is already in use. Please choose a different name.")
    };

    // pro hook transfer
    // const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
    // const slug = `${baseSlug}-division`;
    // payload.slug = slug;
    const division = await Division.create(payload);
    return division;
};

const updateDivisionService = async (id: string, payload: Partial<IDivision>) => {
    const existDivision = await Division.findById(id);
    if (!existDivision) {
        throw new AppError(httpStatus.NOT_FOUND, "Division not found.")
    };
    const isExistDivision = await Division.findOne({ name: payload.name, _id: { $ne: id } });
    if (isExistDivision) {
        throw new AppError(httpStatus.BAD_REQUEST, "This division name is already in use. Please choose a different name.")
    };

    // if (payload.name) {
    //     const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
    //     const slug = `${baseSlug}-division`;
    //     payload.slug = slug;
    // };

    const updateDivision = await Division.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });

    if (payload.thumbnail && existDivision.thumbnail) {
        await deleteImageFromCLoudinary(existDivision.thumbnail)
    };

    return updateDivision;
};

const deleteDivisionService = async (id: string) => {
    const isAssociated = await Tour.findOne({ division: id });
    if (isAssociated) {
        throw new AppError(httpStatus.BAD_REQUEST, "This division is associated with existing tours and cannot be deleted.")
    };
    const deleteDivision = await Division.findByIdAndDelete(id);
    return deleteDivision;
};

export const divisionServices = {
    getDivisionService,
    getSingleDivisionService,
    createDivisionService,
    updateDivisionService,
    deleteDivisionService
};