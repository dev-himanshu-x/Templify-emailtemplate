import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import path from "path";
import React from "react";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config = defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	plugins: [
		tailwindcss(),
		tanstackStart(),
		{
			name: "email-api",
			configureServer(server) {
				server.middlewares.use("/api/send-email", async (req, res) => {
					if (req.method !== "POST") {
						res.writeHead(405);
						res.end("Method Not Allowed");
						return;
					}

					let body = "";
					req.on("data", (chunk) => { body += chunk; });
					req.on("end", () => {
						Promise.resolve().then(async () => {
							const { items, to } = JSON.parse(body);
							console.log("[Email API] Received request for:", to);

							// 1. Dynamic imports for server-side only libs
							const { render } = await import("@react-email/render");
							const nodemailer = await import("nodemailer");

							// 2. Load the EmailTemplate component
							const mod = await server.ssrLoadModule("/src/components/email/EmailTemplate.tsx");
							const EmailTemplate = mod.EmailTemplate;

							// 3. Render to HTML
							console.log("[Email API] Rendering template...");
							let html = await render(React.createElement(EmailTemplate, { items }));

							// 3.5 Personalization (Mail Merge)
							const contactsMod = await server.ssrLoadModule("/src/lib/contacts.ts");
							const contact = contactsMod.contacts.find((c: any) => c.email === to);
							const recipientName = contact ? contact.name : "Valued Customer";
							
							// Replace {{name}} or [name] with the actual name
							html = html.replace(/\{\{name\}\}/gi, recipientName);
							html = html.replace(/\[name\]/gi, recipientName);

							const EMAIL_USER = process.env.EMAIL_USER;
							const EMAIL_PASS = process.env.EMAIL_PASS;

							if (!EMAIL_USER || !EMAIL_PASS) {
								throw new Error("Missing EMAIL_USER or EMAIL_PASS in .env.local");
							}

							// 4. Setup Nodemailer
							const transporter = nodemailer.default.createTransport({
								service: "gmail",
								auth: { user: EMAIL_USER, pass: EMAIL_PASS },
							});

							console.log("[Email API] Sending email...");
							await transporter.sendMail({
								from: `"Email Builder" <${EMAIL_USER}>`,
								to,
								subject: "Email Template Preview",
								html,
							});

							console.log("[Email API] Email sent successfully!");
							res.writeHead(200, { "Content-Type": "application/json" });
							res.end(JSON.stringify({ success: true }));
						}).catch((err: any) => {
							console.error("[Email API] Error:", err.message);
							res.writeHead(500, { "Content-Type": "application/json" });
							res.end(JSON.stringify({ success: false, error: err.message }));
						});
					});
				});
			},
		},
	],
});

export default config;
