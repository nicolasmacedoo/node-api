import { and, asc, ilike, type SQL } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/courses",
		{
			schema: {
				tags: ["Courses"],
				summary: "Get all courses",
				description: "This route retrieves all courses",
				querystring: z.object({
					search: z.string().optional(),
					orderBy: z.enum(["title"]).optional().default("title"),
					page: z.coerce.number().optional().default(1),
				}),
				response: {
					200: z.object({
						courses: z.array(
							z.object({
								id: z.uuid(),
								title: z.string(),
								description: z.string().nullish(),
							}),
						),
						total: z.number(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { search, orderBy, page } = request.query;

			const conditions: SQL[] = [];

			if (search) {
				conditions.push(ilike(courses.title, `%${search}%`));
			}

			const [result, total] = await Promise.all([
				db
					.select()
					.from(courses)
					.where(and(...conditions))
					.orderBy(asc(courses[orderBy]))
					.limit(2)
					.offset((page - 1) * 2),
				db.$count(courses, and(...conditions)),
			]);

			return reply.send({ courses: result, total });
		},
	);
};

//outra forma de escrever o where
//.where(search ? ilike(courses.title, `%${search}%`) : undefined)
