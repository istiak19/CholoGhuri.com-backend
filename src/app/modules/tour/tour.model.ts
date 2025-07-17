import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export const TourType = model<ITourType>("tourType", tourTypeSchema);

const tourSchema = new Schema<ITour>({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
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
        type: Schema.Types.ObjectId,
        ref: "tourType",
        required: true
    },
    division: {
        type: Schema.Types.ObjectId,
        ref: "division",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Tour = model<ITour>("tour", tourSchema);