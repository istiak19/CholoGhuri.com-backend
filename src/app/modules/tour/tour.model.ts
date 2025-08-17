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
        type: String,
        required: true
    },
    arrivalLocation: {
        type: String,
        required: true
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

tourSchema.pre("save", async function (next) {
    if (this.isModified("title")) {
        const slug = this.title.toLocaleLowerCase().split(" ").join("-");
        this.slug = slug;
    }
    next()
});

tourSchema.pre("findOneAndUpdate", async function (next) {
    const tour = this.getUpdate() as Partial<ITour>
    if (tour.title) {
        const slug = tour.title.toLocaleLowerCase().split(" ").join("-");
        tour.slug = slug;
    }
    this.setUpdate(tour)
    next()
});

export const Tour = model<ITour>("tour", tourSchema);