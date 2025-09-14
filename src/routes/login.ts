// Sirineu_Silva@yahoo.com

import { verify } from "argon2";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import jwt from "jsonwebtoken";
import z from "zod/v4";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/sessions",
		{
			schema: {
				tags: ["auth"],
				summary: "Login",
				description: "This route creates a new session",
				body: z.object({
					email: z.email({ message: "Invalid email address" }),
					password: z
						.string()
						.min(6, { message: "Password must be at least 6 characters long" }),
				}),
				response: {
					200: z
						.object({
							token: z.string(),
						})
						.describe("The JWT token"),
					400: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const result = await db
				.select()
				.from(users)
				.where(eq(users.email, email));

			if (result.length === 0) {
				return reply.status(400).send({ message: "Invalid credentials" });
			}

			const user = result[0];

			const doesPasswordsMatch = await verify(user.password, password);

			if (!doesPasswordsMatch) {
				return reply.status(400).send({ message: "Invalid credentials" });
			}

			if (!process.env.JWT_SECRET) {
				throw new Error("JWT_SECRET is not defined");
			}

			const token = jwt.sign(
				{ sub: user.id, role: user.role },
				process.env.JWT_SECRET,
				{ expiresIn: "1h" },
			);

			return reply.status(200).send({ token });
		},
	);
};
