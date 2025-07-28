"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guide = void 0;
const mongoose_1 = require("mongoose");
const guideSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    nidPhoto: {
        type: String,
        required: true
    },
    division: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.Guide = (0, mongoose_1.model)("Guide", guideSchema);
