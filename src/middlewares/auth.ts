import { UserRole } from "../../generated/prisma/enums.ts";
import { auth as betterAuth } from "../lib/auth.ts";
import { NextFunction, Request, Response } from "express";

// Global Type of req.user
declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				name: string;
				email: string;
				emailVerified: boolean;
				role: string;
			};
		}
	}
}

// Middleware Wrapper
const auth = (...roles: UserRole[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// User Session
			const session = await betterAuth.api.getSession({
				headers: req.headers as any,
			});
			// If session doesn't exist
			if (!session) {
				return res.status(401).json({
					success: false,
					message: "You are unauthorized",
					error: {},
				});
			}
			// Set user to request
			req.user = {
				id: session.user.id,
				name: session.user.name,
				email: session.user.email,
				emailVerified: session.user.emailVerified,
				role: session.user.role,
			};
			// If access forbidden
			if (roles.length && !roles.includes(req.user.role as UserRole)) {
				return res.status(403).json({
					success: false,
					message: "You lack access to this operation",
					error: {},
				});
			}
			next();
		} catch (err) {
			next(err);
		}
	};
};

export { auth, UserRole };
