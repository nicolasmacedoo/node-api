import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

type JWTPayload = {
	sub: string;
	role: "student" | "manager";
	iat: number;
	exp: number;
};

export async function checkRequestJwt(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const token = request.headers.authorization;

	if (!token) {
		return reply.status(401).send({ message: "Unauthorized" });
	}

	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined");
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

		request.user = payload;
	} catch (error) {
		console.log(error);
		return reply.status(401).send({ message: "Unauthorized" });
	}
}
