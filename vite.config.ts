import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import path from "path";

const config = defineConfig(({ mode }) => {
	// Make server-only settings from .env.local (such as MAIL_ACCOUNTS) available on process.env.
	const env = loadEnv(mode, process.cwd(), "");
	if (env.MAIL_ACCOUNTS && !process.env.MAIL_ACCOUNTS) process.env.MAIL_ACCOUNTS = env.MAIL_ACCOUNTS;

	return {
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		plugins: [tailwindcss(), tanstackStart(), nitro()],
	};
});

export default config;
