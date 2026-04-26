import { User } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

//* Retrieve Users
const getUsers = async (): Promise<{ users: User[]; total: number }> => {
	// Retrieval
	const users = await prisma.user.findMany({
		orderBy: [
			{
				role: "asc",
			},
		],
	});
	// Return
	return { users, total: users.length };
};

export const usersService = { getUsers };
