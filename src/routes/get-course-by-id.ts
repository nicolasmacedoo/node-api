import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import z from "zod/v4"
import { eq } from "drizzle-orm"

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:id', {
    schema: {
      params: z.object({
        id: z.string().uuid()
      })
    }
  }, async (request, reply) => {
    const { id } = request.params
    const [result] = await db.select().from(courses).where(eq(courses.id, id))

    if (!result) {
      return reply.status(404).send({ message: 'Course not found' })
    }

    return reply.send({ course: result })
  })
}