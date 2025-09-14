import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			enabled: true,
			reporter: ["text", "json", "html"],
			provider: "v8",
			all: true,
			include: ["src/**/*.ts"],
			exclude: ["**/*.test.ts", "src/tests/**"],
		},
	},
});
