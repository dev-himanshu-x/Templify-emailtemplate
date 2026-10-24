import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/senders")({
	server: {
		handlers: {
			// Lists the configured sender addresses. Passwords are never returned.
			GET: async () => {
				const { loadAccounts, sendingEnabled } = await import("@/server/mail");
				if (!sendingEnabled()) return Response.json({ senders: [], disabled: true });
				const senders = loadAccounts().map(({ id, name, email }) => ({ id, name, email }));
				return Response.json({ senders });
			},
		},
	},
});
