import z from "zod";

export const createGuideZodSchema = z.object({
    user: z.string(),
    nidPhoto: z.string(),
    division: z.string()
});

export const updateGuideZodSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
});