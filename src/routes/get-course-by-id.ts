import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/courses/:id",
		{
			schema: {
				tags: ["Courses"],
				summary: "Get a course by ID",
				description: "This route retrieves a course by its ID",
				params: z.object({
					id: z.uuid(),
				}),
				response: {
					200: z.object({
						course: z.object({
							id: z.uuid(),
							title: z.string(),
							description: z.string().nullish(),
						}),
					}),
					404: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const [result] = await db
				.select()
				.from(courses)
				.where(eq(courses.id, id));

			if (!result) {
				return reply.status(404).send({ message: "Course not found" });
			}

			return reply.send({ course: result });
		},
	);
};
