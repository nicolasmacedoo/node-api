import { fastifySwagger } from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createCoursesRoute } from "./routes/create-course.ts";
import { getCourseByIdRoute } from "./routes/get-course-by-id.ts";
import { getCoursesRoute } from "./routes/get-courses.ts";

const server = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
				colorize: true,
			},
		},
	},
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

if (process.env.NODE_ENV === "development") {
	server.register(fastifySwagger, {
		openapi: {
			info: {
				title: "Desafio Node.js",
				description: "API documentation",
				version: "1.0.0",
			},
		},
		transform: jsonSchemaTransform,
	});

	server.register(scalarAPIReference, {
		routePrefix: "/docs",
		configuration: {
			theme: "kepler",
		},
	});
}

server.register(createCoursesRoute);
server.register(getCoursesRoute);
server.register(getCourseByIdRoute);

server.listen({ port: 3333 }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Documentation at ${address}/docs`);
});
