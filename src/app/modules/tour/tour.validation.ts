import z from "zod";

export const createTourZodSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }).min(1, "Title cannot be empty"),
    slug: z.string({
        required_error: "Slug is required",
    }).min(1, "Slug cannot be empty").optional(),
    images: z.array(z.string()).optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    costForm: z.number().optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    tourType: z.string().optional(),
    division: z.string().optional(),
});


export const updatedTourZodSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }).min(1, "Title cannot be empty").optional(),
    slug: z.string({
        required_error: "Slug is required",
    }).min(1, "Slug cannot be empty").optional(),
    images: z.array(z.string()).optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    costForm: z.number().optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    tourType: z.string().optional(),
    division: z.string().optional(),
});

export const createTourTypeZodSchema = z.object({
    name: z.string()
});

export const updateTourTypeZodSchema = z.object({
    name: z.string().optional()
});