import { Router } from "express";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), validateRequest(createBookingZodSchema), bookingController.createBooking);

export const bookingRoutes = router;