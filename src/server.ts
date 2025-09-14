import { server } from "./app.ts";

server.listen({ port: 3333, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Documentation at ${address}/docs`);
});
