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
exports.tourController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const tour_service_1 = require("./tour.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const getTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_service_1.tourService.getTourTypeService();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tour type retrieved successfully",
        data: tourType
    });
}));
const createTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_service_1.tourService.createTourTypeService(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Tour type created successfully",
        data: tourType
    });
}));
const updateTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const tourType = yield tour_service_1.tourService.updateTourTypeService(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tour type updated successfully",
        data: tourType
    });
}));
const deleteTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const tourType = yield tour_service_1.tourService.deleteTourTypeService(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tour type deleted successfully",
        data: tourType
    });
}));
const getTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const tour = yield tour_service_1.tourService.getTourService(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tour retrieved successfully",
        data: tour.tour,
        meta: {
            total: tour.metaData.total,
            page: tour.metaData.page,
            limit: tour.metaData.limit,
            totalPage: tour.metaData.totalPage
        }
    });
}));
const createTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const tour = yield tour_service_1.tourService.createTourService(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Tour created successfully",
        data: tour
    });
}));
const updateTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const tour = yield tour_service_1.tourService.updateTourService(id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tour updated successfully",
        data: tour
    });
}));
const deleteTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const tour = yield tour_service_1.tourService.deleteTourService(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tour deleted successfully",
        data: tour
    });
}));
exports.tourController = {
    getTourType,
    createTourType,
    updateTourType,
    deleteTourType,
    getTour,
    createTour,
    updateTour,
    deleteTour
};
