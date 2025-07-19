import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from '../../utils/QueryBuilder';

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
const getTourService = async (query: Record<string, string>) => {
    const searchFields = ["title", "location", "description"];
    const queryBuilder = new QueryBuilder(Tour.find(), query);
    const tour = await queryBuilder
        .filter()
        .search(searchFields)
        .sort()
        .select()
        .pagination()
        .build();
    const metaData = await queryBuilder.meta()
    return {
        tour,
        metaData
    }
};

const createTourService = async (payload: ITour) => {
    const isExistTour = await Tour.findOne({ title: payload.title });
    if (isExistTour) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour already exists.")
    };
    // const slug = payload.title.toLocaleLowerCase().split(" ").join("-");
    // payload.slug = slug;
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

    // pro hook sent
    // if (payload.title) {
    //     const slug = payload.title.toLocaleLowerCase().split(" ").join("-");
    //     payload.slug = slug;
    // };
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