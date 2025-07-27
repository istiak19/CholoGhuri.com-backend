import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { statisticsController } from "./statistics.controller";

const router = Router();

router.get("/user", checkAuth("ADMIN", "SUPER_ADMIN"), statisticsController.getUser);
router.get("/booking", checkAuth("ADMIN", "SUPER_ADMIN"), statisticsController.getBooking);
router.get("/tour", checkAuth("ADMIN", "SUPER_ADMIN"), statisticsController.getTour);
router.get("/payment", checkAuth("ADMIN", "SUPER_ADMIN"), statisticsController.getPayment);

export const statisticsRoutes = router;