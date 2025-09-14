import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { checkRequestJwt } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const createCoursesRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/courses",
		{
			preHandler: [checkRequestJwt, checkUserRole("manager")],
			schema: {
				tags: ["Courses"],
				summary: "Create a new course",
				description: "This route creates a new course",
				body: z.object({
					title: z
						.string()
						.min(3, { error: "Title must be at least 3 characters long" })
						.max(100, { message: "Title must be at most 100 characters long" }),
					description: z
						.string()
						.min(10, {
							message: "Description must be at least 10 characters long",
						})
						.max(500, {
							message: "Description must be at most 500 characters long",
						})
						.optional(),
				}),
				response: {
					201: z
						.object({
							courseId: z.uuid(),
						})
						.describe("The ID of the newly created course"),
				},
			},
		},
		async (request, reply) => {
			const { title, description } = request.body;

			const [result] = await db
				.insert(courses)
				.values({ title, description })
				.returning();

			return reply.status(201).send({ courseId: result.id });
		},
	);
};
