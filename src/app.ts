import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import { auth } from "./lib/auth.ts";
import { tutorsRouter } from "./modules/tutors/tutors.router.ts";
import { categoriesRouter } from "./modules/categories/categories.router.ts";
import { reviewsRouter } from "./modules/reviews/reviews.router.ts";
import { bookingsRouter } from "./modules/bookings/bookings.router.ts";
import { usersRouter } from "./modules/users/users.router.ts";

//* Express App
const app: Application = express();

//* Global Middlewares
app.use(express.json());
app.use(
	cors({
		origin: [process.env.APP_URL!, "http://localhost:3000"],
		credentials: true,
	}),
);

//* Auth Route Handler
app.all("/api/v1/auth/*splat", toNodeHandler(auth));

//* Modules
app.use(`${process.env.API_BASE}/users`, usersRouter);
app.use(`${process.env.API_BASE}/tutors`, tutorsRouter);
app.use(`${process.env.API_BASE}/categories`, categoriesRouter);
app.use(`${process.env.API_BASE}/reviews`, reviewsRouter);
app.use(`${process.env.API_BASE}/bookings`, bookingsRouter);

//* GET /
app.get("/", (_req, res) => {
	//* 200 Success Response
	res.status(200).json({
		success: true,
		message: "Welcome to FortePath's server",
	});
});

export { app };
