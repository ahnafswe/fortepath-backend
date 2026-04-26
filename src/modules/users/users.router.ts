import { Router } from "express";
import { usersController } from "./users.controller.ts";
import { UserRole } from "../../generated/prisma/enums.ts";
import { auth } from "../../middlewares/auth.ts";

const router = Router();

// GET /
router.get("/", auth(UserRole.ADMIN), usersController.getUsers);

export { router as usersRouter };
