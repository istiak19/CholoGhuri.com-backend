import { Router } from "express";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), validateRequest(createBookingZodSchema), bookingController.createBooking);
router.get("/", checkAuth("ADMIN", "SUPER_ADMIN"), bookingController.allGetBooking);
router.get("/my-bookings", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), bookingController.getMyBooking);
router.get("/:bookingId", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), bookingController.getSingleBooking);

export const bookingRoute = router;