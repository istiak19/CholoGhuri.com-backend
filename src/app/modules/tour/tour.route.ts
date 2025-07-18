import { validateRequest } from './../../middlewares/validateRequest';
import { Router } from "express";
import { tourController } from "./tour.controller";
import { createTourTypeZodSchema, updateTourTypeZodSchema } from './tour.validation';
import { checkAuth } from '../../middlewares/checkAuth';

const router = Router();

router.get("/tour-types", tourController.getTourType);
router.post("/create-tour-type", checkAuth("ADMIN", "SUPER_ADMIN"), validateRequest(createTourTypeZodSchema), tourController.createTourType);
router.patch("/tour-types/:id", checkAuth("ADMIN", "SUPER_ADMIN"), validateRequest(updateTourTypeZodSchema), tourController.updateTourType);
router.delete("/tour-types/:id", checkAuth("ADMIN", "SUPER_ADMIN"), tourController.deleteTourType);

export const tourRouter = router;