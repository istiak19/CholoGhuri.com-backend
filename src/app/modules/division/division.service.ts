import { AppError } from "../../errors/AppError";
import { Tour } from "../tour/tour.model";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from 'http-status';

const getDivisionService = async () => {
    const division = await Division.find();
    const totalDivision = await Division.countDocuments();
    return {
        division,
        totalDivision
    };
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
    createDivisionService,
    updateDivisionService,
    deleteDivisionService
};