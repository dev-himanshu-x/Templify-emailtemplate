import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) => Response.json(body, { status });

export const Route = createFileRoute("/api/send-email")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const { loadAccounts, resolveSender, parseRecipients, recipientFirstName, personalize, MAX_RECIPIENTS, sendingEnabled, allowRequest, clientKey, MAX_BODY_BYTES, MAX_ITEMS } = await import("@/server/mail");

				if (!sendingEnabled()) return json({ success: false, error: "Sending is disabled on this server. Set ALLOW_SEND=true to enable it." }, 403);
				if (!allowRequest(clientKey(request))) return json({ success: false, error: "Too many send requests. Wait a minute and try again." }, 429);
				if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ success: false, error: "The template is too large to send" }, 413);

				let payload: any;
				try {
					payload = await request.json();
				} catch {
					return json({ success: false, error: "Invalid request body" }, 400);
				}

				const { renderEmailHtml, renderEmailText } = await import("@/lib/export");
				const { normalizeSettings } = await import("@/config/email-settings");

				const { items, senderId, sender, to } = payload ?? {};
				if (!Array.isArray(items) || items.length === 0) return json({ success: false, error: "The template is empty" }, 400);
				if (items.length > MAX_ITEMS) return json({ success: false, error: "The template has too many blocks" }, 413);
				if (typeof to !== "string") return json({ success: false, error: "Add at least one recipient" }, 400);

				// Either an account entered in the dialog, or one configured on the server via MAIL_ACCOUNTS.
				let account;
				if (sender && typeof sender === "object") {
					const resolved = resolveSender(sender);
					if ("error" in resolved) return json({ success: false, error: resolved.error }, 400);
					account = resolved.account;
				} else {
					account = typeof senderId === "string" ? loadAccounts().find((a) => a.id === senderId.toLowerCase()) : undefined;
					if (!account) return json({ success: false, error: "Choose a sender account" }, 400);
				}

				const settings = normalizeSettings(payload.settings);
				const prefix = typeof payload.subjectPrefix === "string" ? payload.subjectPrefix.slice(0, 20) : "";
				const subject = settings.subject.trim() ? `${prefix}${settings.subject.trim()}` : "";
				if (!subject) return json({ success: false, error: "Add a subject line in Email settings first" }, 400);

				const { recipients, invalid } = parseRecipients(to);
				if (invalid.length > 0) return json({ success: false, error: `Invalid address: ${invalid.join(", ")}` }, 400);
				if (recipients.length === 0) return json({ success: false, error: "Add at least one recipient" }, 400);
				if (recipients.length > MAX_RECIPIENTS) return json({ success: false, error: `Too many recipients (max ${MAX_RECIPIENTS})` }, 400);

				try {
					const nodemailer = (await import("nodemailer")).default;
					const transporter = nodemailer.createTransport({
						host: account.host,
						port: account.port,
						secure: account.secure,
						auth: { user: account.email, pass: account.pass },
						requireTLS: !account.secure,
					});

					const [baseHtml, baseText] = await Promise.all([renderEmailHtml(items, settings), renderEmailText(items, settings)]);

					// One message per recipient so addresses stay private and {{name}} can be personalised.
					const results = await Promise.allSettled(
						recipients.map((r) => {
							const name = recipientFirstName(r);
							return transporter.sendMail({
								from: { name: account.name, address: account.email },
								to: r.name ? { name: r.name, address: r.email } : r.email,
								subject,
								html: personalize(baseHtml, name),
								text: baseText.replace(/\{\{\s*name\s*\}\}|\[name\]/gi, name),
							});
						}),
					);

					const failed = results.flatMap((res, i) => (res.status === "rejected" ? [{ email: recipients[i].email, error: String(res.reason?.message ?? res.reason) }] : []));
					const sent = recipients.length - failed.length;
					if (sent === 0) return json({ success: false, error: failed[0]?.error ?? "Failed to send", failed }, 502);
					return json({ success: true, sent, failed });
				} catch (err: any) {
					console.error("[send-email]", err?.code ?? err?.message);
					const message = err?.code === "EAUTH" ? "The sender rejected the login. For Gmail, use an app password rather than your normal password." : (err?.message ?? "Failed to send");
					return json({ success: false, error: message }, 500);
				}
			},
		},
	},
});
