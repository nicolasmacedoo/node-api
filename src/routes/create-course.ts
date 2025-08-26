import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import z from "zod/v4"

export const createCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses', {
    schema: {
      body: z.object({
        title: z.string().min(3, { error: 'Title must be at least 3 characters long' }).max(100, { message: 'Title must be at most 100 characters long' }),
        description: z.string().min(10, { message: 'Description must be at least 10 characters long' }).max(500, { message: 'Description must be at most 500 characters long' }).optional()
      })
    }
  }, async (request, reply) => {
    const { title, description } = request.body

    const [result] = await db.insert(courses).values({ title, description }).returning()

    return reply.status(201).send({ courseId: result.id })
  })

}