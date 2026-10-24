import React from "react";

import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import Layout from "@/components/builder/layout";
import appCss from "../styles.css?url";
export const Route = createRootRoute({
	head: () => ({
		title: "Email Template Builder | Create Professional Emails",
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{
				name: "description",
				content:
					"Build beautiful, responsive email templates with ease using our professional drag-and-drop builder. Perfect for marketers and developers.",
			},
			{
				name: "keywords",
				content:
					"email builder, email template, responsive email, drag and drop email, marketing automation",
			},
			{ property: "og:title", content: "Email Template Builder" },
			{
				property: "og:description",
				content:
					"Build beautiful, responsive email templates with ease using our professional drag-and-drop builder.",
			},
			{ property: "og:type", content: "website" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "Email Template Builder" },
			{
				name: "twitter:description",
				content:
					"Build beautiful, responsive email templates with ease using our professional drag-and-drop builder.",
			},
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
});
function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="m-0 p-0 overflow-hidden">
				<Layout>{children}</Layout>
				<Analytics />
				<Scripts />
			</body>
		</html>
	);
}
