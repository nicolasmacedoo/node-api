import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { enrollments } from "../../database/schema.ts";

export async function makeEnrollment(userId?: string, courseId?: string) {
	const result = await db
		.insert(enrollments)
		.values({
			courseId: courseId ?? faker.string.uuid(),
			userId: userId ?? faker.string.uuid(),
		})
		.returning();

	return result[0];
}
