import { randomUUID } from "node:crypto";
import request from "supertest";
import { expect, test } from "vitest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeEnrollment } from "../tests/factories/make-enrollment.ts";
import {
	makeAuthenticatedUser,
	makeUser,
} from "../tests/factories/make-user.ts";

test("get courses", async () => {
	await server.ready();

	//utilizamos o search para garantir que o curso criado está na resposta
	//porque nao estamos limpando o banco entre os testes
	//então pode ter outros cursos criados em outros testes e o curso criado aqui pode não estar na primeira página
	const titleId = randomUUID();

	const { token } = await makeAuthenticatedUser("manager");

	const { user } = await makeUser();
	const course = await makeCourse(titleId);
	await makeEnrollment(user.id, course.id);

	const response = await request(server.server)
		.get(`/courses?search=${titleId}`)
		.set("Authorization", token);

	expect(response.status).toEqual(200);
	expect(response.body).toEqual(
		expect.objectContaining({
			total: expect.any(Number),
			courses: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					title: expect.stringContaining(titleId),
					enrollments: 1,
				}),
			]),
		}),
	);
});
