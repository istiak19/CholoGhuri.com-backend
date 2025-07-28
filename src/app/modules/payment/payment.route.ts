import { Router } from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/invoice/:id", checkAuth("ADMIN", "SUPER_ADMIN", "USER", "GUIDE"), paymentController.getInvoicePayment);
router.post("/success", paymentController.successPayment);
router.post("/fail", paymentController.failPayment);
router.post("/cancel", paymentController.cancelPayment);
router.post("/init-payment/:bookingID", paymentController.initPayment);
router.post("/validate-payment", paymentController.validatePayment);

export const paymentRoutes = router;