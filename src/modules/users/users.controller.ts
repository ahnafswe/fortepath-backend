import { Request, Response } from "express";
import { User } from "../../../generated/prisma/client.ts";
import { usersService } from "./users.service.ts";

//* Retrieve Users
const getUsers = async (req: Request, res: Response) => {
	try {
		// Retrieve data
		const result: { users: User[]; total: number } = await usersService.getUsers();
		// 200 success response
		return res.status(200).json({
			success: true,
			message: "Users retrieved successfully",
			total: result.total,
			data: result.users,
		});
	} catch (err: any) {
		// 500 error response
		return res.status(500).json({
			success: false,
			message: "Unable to retrieve users",
			error: {
				code: err.code || undefined,
				message: err.message || undefined,
				details: err,
			},
		});
	}
};

export const usersController = { getUsers };
