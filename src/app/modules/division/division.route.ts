import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema, updatedDivisionZodSchema } from "./division.validation";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", divisionController.getDivision);
router.post("/create", checkAuth("ADMIN", "SUPER_ADMIN"), validateRequest(createDivisionZodSchema), divisionController.createDivision);
router.get("/:slug", divisionController.getSingleDivision);
router.patch("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), validateRequest(updatedDivisionZodSchema), divisionController.updateDivision);
router.delete("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), divisionController.deleteDivision);


export const divisionRouter = router;