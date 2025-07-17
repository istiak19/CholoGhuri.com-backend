import { Types } from "mongoose";

export interface ITour {
    title: string;
    slug: string;
    images?: string[];
    description?: string;
    location?: string;
    costForm?: number;
    departureLocation?: string;
    arrivalLocation?: string;
    startDate?: Date;
    endDate?: Date;
    included?: string[];
    excluded?: string[];
    amenities?: string[];
    tourPlan?: string[];
    maxGuest?: number;
    minAge?: number;
    tourType: Types.ObjectId;
    division: Types.ObjectId
};


export interface ITourType {
    name: string
};