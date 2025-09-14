import request from "supertest";
import { expect, test } from "vitest";
import { server } from "../app.ts";
import { makeUser } from "../tests/factories/make-user.ts";

test("login", async () => {
	await server.ready();

	const { user, passwordBeforeHash } = await makeUser();

	const response = await request(server.server)
		.post("/sessions")
		.set("Content-Type", "application/json")
		.send({
			email: user.email,
			password: passwordBeforeHash,
		});

	expect(response.status).toEqual(200);
	expect(response.body).toEqual(
		expect.objectContaining({
			token: expect.any(String),
		}),
	);
});
