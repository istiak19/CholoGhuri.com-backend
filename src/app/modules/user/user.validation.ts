import z from "zod";

export const createUserZodSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }).min(1, "Name cannot be empty"),

    email: z.string({
        required_error: "Email is required",
    }).email("Invalid email address"),

    password: z
        .string({
            required_error: "Password is required",
        })
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),

    phone: z
        .string({
            required_error: "Phone number is required",
        })
        .regex(
            /^(?:\+88|88)?01[3-9]\d{8}$/,
            "Invalid Bangladeshi phone number"
        ).optional(),

    address: z.string({
        required_error: "Address is required",
    }).optional(),
});

export const updatedUserZodSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }).min(1, "Name cannot be empty"),

    password: z
        .string({
            required_error: "Password is required",
        })
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }).optional(),

    phone: z
        .string({
            required_error: "Phone number is required",
        })
        .regex(
            /^(?:\+88|88)?01[3-9]\d{8}$/,
            "Invalid Bangladeshi phone number"
        ).optional(),

    role: z.enum(["ADMIN", "USER", "SUPER_ADMIN", "GUIDE"]).optional(),

    isActive: z
        .enum(["Active", "Inactive", "Blocked"]).optional(),

    isDeleted: z
        .boolean({ invalid_type_error: "isDeleted must be true or false" }).optional(),

    isVerified: z
        .boolean({ invalid_type_error: "isVerified must be true or false" }).optional(),

    address: z.string({
        required_error: "Address is required",
    }).optional(),
});