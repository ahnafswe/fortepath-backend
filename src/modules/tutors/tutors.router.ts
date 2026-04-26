import { Router } from "express";
import { tutorsController } from "./tutors.controller.ts";
import { UserRole } from "../../../generated/prisma/enums.ts";
import { auth } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", tutorsController.registerTutor);
// GET /
router.get("/", tutorsController.getTutors);
// GET /:id
router.get("/:id", tutorsController.getTutor);

// POST /categories
router.post("/categories", auth(UserRole.TUTOR, UserRole.ADMIN), tutorsController.addCategory);

export { router as tutorsRouter };
