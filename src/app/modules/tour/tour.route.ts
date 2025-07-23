import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from './../../middlewares/validateRequest';
import { createTourTypeZodSchema, createTourZodSchema, updatedTourZodSchema, updateTourTypeZodSchema } from './tour.validation';
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get("/tour-types", tourController.getTourType);
router.post("/create-tour-type", checkAuth("ADMIN", "SUPER_ADMIN"), validateRequest(createTourTypeZodSchema), tourController.createTourType);
router.patch("/tour-types/:id", checkAuth("ADMIN", "SUPER_ADMIN"), validateRequest(updateTourTypeZodSchema), tourController.updateTourType);
router.delete("/tour-types/:id", checkAuth("ADMIN", "SUPER_ADMIN"), tourController.deleteTourType);

// Tour route
router.get("/", tourController.getTour);
router.post("/create", checkAuth("ADMIN", "SUPER_ADMIN"), multerUpload.array("files"), validateRequest(createTourZodSchema), tourController.createTour);
router.patch("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), multerUpload.array("files"), validateRequest(updatedTourZodSchema), tourController.updateTour);
router.delete("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), tourController.deleteTour);

export const tourRouters = router;