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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = exports.TourType = void 0;
const mongoose_1 = require("mongoose");
const tourTypeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.TourType = (0, mongoose_1.model)("tourType", tourTypeSchema);
const tourSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    images: {
        type: [String],
        default: []
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    costForm: {
        type: Number
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    departureLocation: {
        type: String
    },
    arrivalLocation: {
        type: String
    },
    included: {
        type: [String],
        default: []
    },
    excluded: {
        type: [String],
        default: []
    },
    amenities: {
        type: [String],
        default: []
    },
    tourPlan: {
        type: [String],
        default: []
    },
    maxGuest: {
        type: Number
    },
    minAge: {
        type: Number
    },
    tourType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "tourType",
        required: true
    },
    division: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "division",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
tourSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("title")) {
            const slug = this.title.toLocaleLowerCase().split(" ").join("-");
            this.slug = slug;
        }
        next();
    });
});
tourSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tour = this.getUpdate();
        if (tour.title) {
            const slug = tour.title.toLocaleLowerCase().split(" ").join("-");
            tour.slug = slug;
        }
        this.setUpdate(tour);
        next();
    });
});
exports.Tour = (0, mongoose_1.model)("tour", tourSchema);
