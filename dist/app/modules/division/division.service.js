"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.divisionServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const tour_model_1 = require("../tour/tour.model");
const division_model_1 = require("./division.model");
const AppError_1 = require("../../errors/AppError");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const getDivisionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.find();
    const totalDivision = yield division_model_1.Division.countDocuments();
    return {
        division,
        totalDivision
    };
});
const getSingleDivisionService = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({ slug });
    return division;
});
const createDivisionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistDivision = yield division_model_1.Division.findOne({ name: payload.name });
    if (isExistDivision) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "This division name is already in use. Please choose a different name.");
    }
    ;
    // pro hook transfer
    // const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
    // const slug = `${baseSlug}-division`;
    // payload.slug = slug;
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const updateDivisionService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existDivision = yield division_model_1.Division.findById(id);
    if (!existDivision) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Division not found.");
    }
    ;
    const isExistDivision = yield division_model_1.Division.findOne({ name: payload.name, _id: { $ne: id } });
    if (isExistDivision) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "This division name is already in use. Please choose a different name.");
    }
    ;
    // if (payload.name) {
    //     const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
    //     const slug = `${baseSlug}-division`;
    //     payload.slug = slug;
    // };
    const updateDivision = yield division_model_1.Division.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    if (payload.thumbnail && existDivision.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existDivision.thumbnail);
    }
    ;
    return updateDivision;
});
const deleteDivisionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isAssociated = yield tour_model_1.Tour.findOne({ division: id });
    if (isAssociated) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "This division is associated with existing tours and cannot be deleted.");
    }
    ;
    const deleteDivision = yield division_model_1.Division.findByIdAndDelete(id);
    return deleteDivision;
});
exports.divisionServices = {
    getDivisionService,
    getSingleDivisionService,
    createDivisionService,
    updateDivisionService,
    deleteDivisionService
};
