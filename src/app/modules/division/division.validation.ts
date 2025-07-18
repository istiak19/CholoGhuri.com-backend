import z from "zod";

export const createDivisionZodSchema = z.object({
    name: z.string({ required_error: "Name is required", }).min(1, "Name cannot be empty"),
    slug: z.string({ required_error: "Slug is required", }).min(1, "Slug cannot be empty").optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional()
});

export const updatedDivisionZodSchema = z.object({
    name: z.string().optional(),
    slug: z.string({ required_error: "Slug is required", }).min(1, "Slug cannot be empty").optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional()
});