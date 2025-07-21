import { Router } from "express";
<<<<<<< HEAD
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";
=======
>>>>>>> e21e2a062c7c881150978916dd2786b19f90ca05
import { checkAuth } from "../../middlewares/checkAuth";
import { bookingController } from "./booking.controller";
import { createBookingZodSchema } from "./booking.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post("/", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), validateRequest(createBookingZodSchema), bookingController.createBooking);
router.get("/", checkAuth("ADMIN", "SUPER_ADMIN"), bookingController.allGetBooking);
router.get("/my-bookings", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), bookingController.getMyBooking);
router.get("/:bookingId", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), bookingController.getSingleBooking);
router.patch("/:bookingId/status", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), validateRequest(updateBookingStatusZodSchema), bookingController.updateBooking);

export const bookingRoutes = router;