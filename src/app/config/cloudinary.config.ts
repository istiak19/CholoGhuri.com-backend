/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../errors/AppError";
import { envVars } from "./env.config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET
});

export const deleteImageFromCLoudinary = async (url: string) => {
    try {
        // https://res.cloudinary.com/dtqtvdnuo/image/upload/v1753245642/oreu3b2g21a-1753245635105-rangpurtown.jpg
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
            console.log(`File ${public_id} is deleted from cloudinary`);
        };
    } catch (error: any) {
        throw new AppError(401, "Cloudinary image deletion failed", error.message);
    }
};

export const cloudinaryUpload = cloudinary;