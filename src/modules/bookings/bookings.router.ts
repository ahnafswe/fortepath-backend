import { Router } from "express";
import { bookingsController } from "./bookings.controller.ts";
import { auth } from "../../middlewares/auth.ts";
import { UserRole } from "../../generated/prisma/enums.ts";

const router = Router();

// POST /
router.post("/", auth(UserRole.STUDENT, UserRole.ADMIN), bookingsController.createBooking);
// GET /
router.get(
	"/",
	auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
	bookingsController.getBookings,
);

export { router as bookingsRouter };
