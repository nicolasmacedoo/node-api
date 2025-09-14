import request from "supertest";
import { expect, test } from "vitest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

test("get course by id", async () => {
	await server.ready();

	const { token } = await makeAuthenticatedUser("student");
	const course = await makeCourse();

	const response = await request(server.server)
		.get(`/courses/${course.id}`)
		.set("Authorization", token);

	expect(response.status).toEqual(200);
	expect(response.body).toEqual(
		expect.objectContaining({
			course: expect.objectContaining({
				id: expect.any(String),
				title: expect.any(String),
				description: null,
			}),
		}),
	);
});

test("return 404 for non existing courses", async () => {
	await server.ready();

	const { token } = await makeAuthenticatedUser("student");

	const response = await request(server.server)
		.get(`/courses/00000000-0000-0000-0000-000000000000`)
		.set("Authorization", token);

	expect(response.status).toEqual(404);
	expect(response.body).toEqual(
		expect.objectContaining({
			message: "Course not found",
		}),
	);
});
