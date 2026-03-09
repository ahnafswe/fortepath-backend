import { Router } from "express";
import { categoriesController } from "./categories.controller.ts";
import { UserRole } from "../../../generated/prisma/enums.ts";
import { auth } from "../../middlewares/auth.ts";

const router = Router();

// POST /
router.post("/", auth(UserRole.TUTOR, UserRole.ADMIN), categoriesController.createCategory);
// GET /
router.get("/", categoriesController.getCategories);
// GET /:id
router.get(
	"/:id",
	auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
	categoriesController.getCategory,
);
// DELETE /:id
router.delete("/:id", auth(UserRole.ADMIN), categoriesController.deleteCategory);

export { router as categoriesRouter };
