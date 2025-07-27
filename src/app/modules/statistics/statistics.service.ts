/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUser = async () => {
    const totalUsersPromise = User.countDocuments();
    const totalActiveUsersPromise = User.countDocuments({ isActive: "Active" });
    const totalBlockedUsersPromise = User.countDocuments({ isActive: "Blocked" });
    const totalInactiveUsersPromise = User.countDocuments({ isActive: "Inactive" });
    const newUsersInLast7DaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newUsersInLast30DaysPromise = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const usersByRolePromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [
        totalUsers,
        totalActiveUsers,
        totalBlockedUsers,
        totalInactiveUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    ] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalBlockedUsersPromise,
        totalInactiveUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ]);

    return {
        totalUsers,
        totalActiveUsers,
        totalBlockedUsers,
        totalInactiveUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    };
};

const getTour = async () => {
    const totalTourPromise = Tour.countDocuments();
    const totalTourByTourTypePromise = Tour.aggregate([
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },
        {
            $unwind: "$type"
        },
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 }
            }
        }
    ]);

    const totalTourByDivisionPromise = Tour.aggregate([
        // stage-1 : connect Division model - lookup stage
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },
        //stage - 2 : unwind the array to object

        {
            $unwind: "$division"
        },

        //stage - 3 : grouping tour type
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 }
            }
        }
    ]);

    const avgTourCostPromise = Tour.aggregate([
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costForm" }
            }
        }
    ]);

    const totalHighestBookedTourPromise = Booking.aggregate([
        // {
        //     $group: {
        //         _id: "$tour",
        //         bookingCount: { $sum: 1 }
        //     }
        // },
        // {
        //     $sort: { bookingCount: -1 }
        // },
        // {
        //     $limit: 4
        // },
        // {
        //     $lookup: {
        //         from: "tours",
        //         let: { tourId: "$_id" },
        //         pipeline: [
        //             {
        //                 $match: {
        //                     $expr: {
        //                         $eq: ["$_id", "$$tourId"]
        //                     }
        //                 }
        //             }
        //         ],
        //         as: "tour"
        //     }
        // },
        // {
        //     $unwind: "$tour"
        // },
        // {
        //     $project: {
        //         bookingCount: 1,
        //         "tour.title": 1,
        //         "tour.slug": 1,
        //         "_id": 0
        //     }
        // }

        // way-2

        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $sort: { bookingCount: -1 }
        },
        {
            $limit: 4
        },
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        {
            $unwind: "$tour"
        },
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }

    ])

    const [totalTour, totalTourByTourType, avgTourCost, totalTourByDivision, totalHighestBookedTour] = await Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookedTourPromise
    ]);

    return {
        totalTour,
        totalTourByTourType,
        avgTourCost,
        totalTourByDivision,
        totalHighestBookedTour
    };
};

const getBooking = async () => {
    const totalBookingPromise = Booking.countDocuments();
    const totalBookingByStatusPromise = Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const bookingsPerTourPromise = Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $sort: { bookingCount: -1 }
        },
        {
            $limit: 4
        },
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        {
            $unwind: "$tour"
        },
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ]);

    const avgGuestCountPerBookingPromise = Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ]);

    const bookingsLast7DaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });

    const bookingsLast30DaysPromise = Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    const totalBookingByUniqueUsersPromise = Booking.distinct("users").then((user: any) => user.length);

    const [totalBooking, totalBookingByStatus, bookingsPerTour, avgGuestCountPerBooking, bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUsers] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingsPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingsLast7DaysPromise,
        bookingsLast30DaysPromise,
        totalBookingByUniqueUsersPromise
    ]);
    return {
        totalBooking,
        totalBookingByStatus,
        bookingsPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        bookingsLast7Days,
        bookingsLast30Days,
        totalBookingByUniqueUsers
    }
};

const getPayment = async () => {
    return {}
};

export const statisticsService = {
    getUser,
    getTour,
    getBooking,
    getPayment
};