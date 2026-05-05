import { TutorProfile, TutorCategory, UserRole } from "../../../generated/prisma/client.ts";
import { BatchPayload } from "../../../generated/prisma/internal/prismaNamespace.ts";
import { prisma } from "../../lib/prisma.ts";

//* Register a Tutor
const registerTutor = async (
	data: Omit<TutorProfile, "id" | "createdAt" | "updatedAt"> & { categoryIds: string[] },
): Promise<{ tutor: Omit<TutorProfile, "updatedAt">; tutorCategories: BatchPayload }> => {
	// Validate user's existence
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: data.userId,
			role: UserRole.TUTOR,
		},
	});
	// Insertion
	const result = await prisma.tutorProfile.create({
		data: {
			userId: data.userId,
			designation: data.designation,
			bio: data.bio,
			hourlyRate: data.hourlyRate,
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
	});
	const tutorCategoriesResult = await prisma.tutorCategory.createMany({
		data: [
			...data.categoryIds.map((categoryId) => ({
				tutorId: result.id,
				categoryId,
			})),
		],
	});
	// Return
	return {
		tutor: result,
		tutorCategories: tutorCategoriesResult,
	};
};

//* Retrieve Tutors
const getTutors = async (q: {
	category?: string;
	search?: string;
	page?: number;
	limit?: number;
}): Promise<{ tutors: TutorProfile[]; total: number }> => {
	// Normalized queries
	const conditions: object[] = [];
	const presentation: {
		skip?: number;
		take?: number;
	} = {};
	// Filter by category
	if (q.category) {
		conditions.push({
			tutorCategories: {
				some: {
					category: {
						OR: [
							{
								name: {
									contains: q.category,
									mode: "insensitive",
								},
							},
							{
								slug: {
									contains: q.category,
									mode: "insensitive",
								},
							},
						],
					},
				},
			},
		});
	}
	// Search
	if (q.search) {
		conditions.push({
			OR: [
				// Name
				{
					user: {
						name: {
							contains: q.search,
							mode: "insensitive",
						},
					},
				},
				// Designation
				{
					designation: {
						contains: q.search,
						mode: "insensitive",
					},
				},
				// Category
				{
					tutorCategories: {
						some: {
							category: {
								name: {
									contains: q.search,
									mode: "insensitive",
								},
							},
						},
					},
				},
				// Hourly Rate
				{
					hourlyRate: Number(q.search) || undefined,
				},
				// Rating
				{
					reviews: {
						some: {
							rating: Number(q.search) || undefined,
						},
					},
				},
			],
		});
	}
	// Offset pagination
	if (q.page && q.limit) {
		presentation.skip = q.limit * (q.page - 1);
		presentation.take = q.limit;
	}
	// Retrieval
	const tutors = await prisma.tutorProfile.findMany({
		where: {
			AND: conditions,
		},
		skip: presentation.skip,
		take: presentation.take,
		include: {
			user: {
				select: {
					id: true,
					name: true,
					image: true,
					email: true,
					tutorReviews: {
						select: {
							rating: true,
							feedback: true,
						},
					},
				},
			},
			tutorCategories: {
				select: {
					category: {
						select: { id: true, name: true, slug: true, description: true },
					},
				},
			},
		},
	});
	// Return
	return { tutors, total: tutors.length };
};

//* Retrieve a Tutor
const getTutor = async (id: string): Promise<TutorProfile> => {
	const result = await prisma.tutorProfile.findFirstOrThrow({
		where: {
			OR: [{ id }, { userId: id }],
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
					tutorBookings: {
						include: {
							student: {
								select: {
									id: true,
									name: true,
									image: true,
								},
							},
						},
						omit: {
							studentId: true,
							tutorId: true,
						},
					},
					tutorReviews: {
						select: {
							id: true,
							student: {
								select: {
									id: true,
									name: true,
									image: true,
								},
							},
							rating: true,
							feedback: true,
							createdAt: true,
						},
					},
				},
			},
			tutorCategories: {
				select: {
					category: {
						select: {
							id: true,
							name: true,
							slug: true,
							description: true,
						},
					},
				},
			},
		},
	});
	return result;
};

//* Add Category to Tutor
const addCategory = async (data: TutorCategory): Promise<TutorCategory> => {
	// Validate category's existence
	await prisma.category.findUniqueOrThrow({
		where: {
			id: data.categoryId,
		},
	});
	// Validate tutor's existence
	await prisma.tutorProfile.findUniqueOrThrow({
		where: {
			id: data.tutorId,
			user: {
				role: UserRole.TUTOR,
			},
		},
	});
	// Insertion
	const result = await prisma.tutorCategory.create({
		data,
	});
	// Return
	return result;
};

export const tutorsService = { registerTutor, getTutors, getTutor, addCategory };
