import { model, Schema } from "mongoose";
import { IGuide } from "./guide.interface";

const guideSchema = new Schema<IGuide>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    nidPhoto: {
        type: String,
        required: true
    },
    division: {
        type: Schema.Types.ObjectId,
        ref: "division",
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    }
}, {
    versionKey: false,
    timestamps: true
});

export const Guide = model<IGuide>("Guide", guideSchema);