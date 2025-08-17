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
exports.tourService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const tour_model_1 = require("./tour.model");
const AppError_1 = require("../../errors/AppError");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const getTourTypeService = () => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.find();
    return tourType;
});
const createTourTypeService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistTourType = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (isExistTourType) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Tour type already exists.");
    }
    ;
    const tourType = yield tour_model_1.TourType.create(payload);
    return tourType;
});
const updateTourTypeService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    const isExistTourType = yield tour_model_1.TourType.findOne({ name: payload.name, _id: { $ne: id } });
    if (isExistTourType) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Tour type already exists.");
    }
    ;
    const tourType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return tourType;
});
const deleteTourTypeService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    const isExistTourType = yield tour_model_1.Tour.findOne({ tourType: id });
    if (isExistTourType) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "This tourType is associated with existing tours and cannot be deleted.");
    }
    ;
    const tourType = yield tour_model_1.TourType.findByIdAndDelete(id);
    return tourType;
});
// const getTourService = async (query: Record<string, string>) => {
//     const filter = query;
//     const searchFields = ["title", "location", "description"];
//     delete filter["search"]
//     delete filter["sort"]
//     const searchQuery = query.search || " ";
//     const searchTerm = { $or: searchFields.map(field => ({ [field]: { $regex: searchQuery, $options: "i" } })) };
//     const sort = query.sort || "startDate";
//     const select = query?.select?.split(",").join(" ") || " ";
//     const page = Number(query.page) || 1;
//     const limit = Number(query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const filterQuery = Tour.find(filter);
//     const tours = filterQuery.find(searchTerm);
//     const allTour = await tours.sort(sort).select(select).skip(skip).limit(limit);
//     const totalTour = await Tour.countDocuments();
//     const totalPage = Math.ceil(totalTour / limit);
//     return {
//         allTour,
//         totalTour,
//         page,
//         limit,
//         totalPage
//     };
//     // way-2
//     // const { search = "", sort = "startDate", select, limit = 10, page = 1, ...filter } = query;
//     // const searchFields = ["title", "location", "description"];
//     // const searchTerm = { $or: searchFields.map(field => ({ [field]: { $regex: search, $options: "i" } })) };
//     // const selected = select?.split(',').join(" ");
//     // const skip = (Number(page) - 1) * Number(limit);
//     // const searchTerm = {
//     //     $or: [
//     //         { title: { $regex: searchQuery, $options: "i" } },
//     //         { location: { $regex: searchQuery, $options: "i" } },
//     //         { description: { $regex: searchQuery, $options: "i" } }
//     //     ]
//     // };
//     // const tour = await Tour.find(searchTerm).sort(sort).select(select).skip(skip).limit(limit);
//     // const finalQuery = { ...searchTerm, ...filter };
//     // const tours = Tour.find(finalQuery);
//     // const allTour = await tours.sort(sort).skip(skip).select(selected).limit(Number(limit));
//     // const totalTour = await Tour.countDocuments();
//     // const totalPage = Math.ceil(totalTour / Number(limit));
//     // return {
//     //     allTour,
//     //     totalTour,
//     //     page: Number(page),
//     //     limit: Number(limit),
//     //     totalPage
//     // };
// };
// best way
const getTourService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchFields = ["title", "location", "description"];
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tour = yield queryBuilder
        .filter()
        .search(searchFields)
        .sort()
        .select()
        .pagination()
        .build()
        .populate("division", "_id name");
    // .populate("tourType", "_id name");
    const metaData = yield queryBuilder.meta();
    return {
        tour,
        metaData
    };
});
const createTourService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistTour = yield tour_model_1.Tour.findOne({ title: payload.title });
    if (isExistTour) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Tour already exists.");
    }
    ;
    // const slug = payload.title.toLocaleLowerCase().split(" ").join("-");
    // payload.slug = slug;
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
const updateTourService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found.");
    }
    ;
    const isExistTour = yield tour_model_1.Tour.findOne({ title: payload.title, _id: { $ne: id } });
    if (isExistTour) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Tour already exists.");
    }
    ;
    // pro hook sent
    // if (payload.title) {
    //     const slug = payload.title.toLocaleLowerCase().split(" ").join("-");
    //     payload.slug = slug;
    // };
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    ;
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter(imageUrl => !restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    ;
    const tour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    ;
    return tour;
});
const deleteTourService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.Tour.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }
    const tour = yield tour_model_1.Tour.findByIdAndDelete(id);
    return tour;
});
exports.tourService = {
    getTourTypeService,
    createTourTypeService,
    updateTourTypeService,
    deleteTourTypeService,
    getTourService,
    createTourService,
    updateTourService,
    deleteTourService
};
