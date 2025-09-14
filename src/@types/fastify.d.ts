// biome-ignore lint/correctness/noUnusedImports: used in module augmentation
import fastify from "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		user?: {
			sub: string;
			role: "student" | "manager";
			iat: number;
			exp: number;
		};
	}
}
