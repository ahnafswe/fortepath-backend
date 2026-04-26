import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/server.ts"],
	format: ["esm"],
	target: "esnext",
	outDir: "dist",
	splitting: false,
	sourcemap: true,
	bundle: true,
	clean: true,
	banner: {
		js: `
            import { createRequire } from "module";
            const require = createRequire(import.meta.url);
        `,
	},
});
