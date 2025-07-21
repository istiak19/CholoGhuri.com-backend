import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { bookingController } from "./booking.controller";
import { createBookingZodSchema } from "./booking.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post("/", checkAuth("ADMIN", "USER", "SUPER_ADMIN", "GUIDE"), validateRequest(createBookingZodSchema), bookingController.createBooking);

export const bookingRoutes = router;