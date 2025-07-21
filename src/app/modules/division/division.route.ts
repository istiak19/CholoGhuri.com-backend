import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { divisionController } from "./division.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema, updatedDivisionZodSchema } from "./division.validation";

const router = Router();

router.get("/", divisionController.getDivision);
router.post("/create", checkAuth("ADMIN", "SUPER_ADMIN"), validateRequest(createDivisionZodSchema), divisionController.createDivision);
router.get("/:slug", divisionController.getSingleDivision);
router.patch("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), validateRequest(updatedDivisionZodSchema), divisionController.updateDivision);
router.delete("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), divisionController.deleteDivision);


export const divisionRouters = router;