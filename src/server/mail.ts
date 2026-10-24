/** Server-only mail helpers. Never import this from client components. */

export interface MailAccount {
	id: string;
	name: string;
	email: string;
	pass: string;
	host: string;
	port: number;
	secure: boolean;
}

/**
 * Sender accounts come from the MAIL_ACCOUNTS env var (JSON array), so SMTP passwords stay on the server.
 * Example: [{"name":"Acme","email":"me@gmail.com","pass":"app-password"}]
 * `host` defaults to smtp.gmail.com and `port` to 465.
 */
export function loadAccounts(): MailAccount[] {
	const raw = process.env.MAIL_ACCOUNTS;
	if (!raw) return [];
	try {
		const list = JSON.parse(raw);
		if (!Array.isArray(list)) return [];
		return list
			.filter((a) => a && typeof a.email === "string" && typeof a.pass === "string")
			.map((a) => {
				const port = Number(a.port) || 465;
				return {
					id: a.email.toLowerCase(),
					name: typeof a.name === "string" && a.name ? a.name : a.email,
					email: a.email,
					pass: a.pass,
					host: typeof a.host === "string" && a.host ? a.host : "smtp.gmail.com",
					port,
					secure: a.secure ?? port === 465,
				};
			});
	} catch {
		return [];
	}
}

export interface SenderInput {
	name?: string;
	email?: string;
	pass?: string;
	host?: string;
	port?: number | string;
}

/** SMTP settings for common providers, keyed by the domain of the sender address. */
const PROVIDERS: Record<string, { host: string; port: number }> = {
	"gmail.com": { host: "smtp.gmail.com", port: 465 },
	"googlemail.com": { host: "smtp.gmail.com", port: 465 },
	"outlook.com": { host: "smtp-mail.outlook.com", port: 587 },
	"hotmail.com": { host: "smtp-mail.outlook.com", port: 587 },
	"live.com": { host: "smtp-mail.outlook.com", port: 587 },
	"yahoo.com": { host: "smtp.mail.yahoo.com", port: 465 },
	"icloud.com": { host: "smtp.mail.me.com", port: 587 },
	"me.com": { host: "smtp.mail.me.com", port: 587 },
};

/** Refuses loopback and private-network hosts so the server can't be pointed at internal services. */
export function isPublicHost(host: string): boolean {
	const h = host.trim().toLowerCase();
	if (!h || h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
	if (/^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h)) return false;
	if (h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return false;
	return true;
}

/** Validates a user-supplied sender and fills in host/port from the address when they are omitted. */
export function resolveSender(input: SenderInput): { account: MailAccount } | { error: string } {
	const email = input.email?.trim() ?? "";
	const pass = input.pass ?? "";
	if (!EMAIL_RE.test(email)) return { error: "Enter a valid sender email address" };
	if (!pass) return { error: "Enter the password or app password for the sender account" };

	const preset = PROVIDERS[email.split("@")[1].toLowerCase()];
	const host = input.host?.trim() || preset?.host;
	if (!host) return { error: "Enter the SMTP host for this email provider (for example smtp.example.com)" };
	if (!isPublicHost(host)) return { error: "That SMTP host isn't allowed" };

	const port = Number(input.port) || preset?.port || 465;
	if (!Number.isInteger(port) || port < 1 || port > 65535) return { error: "Enter a valid SMTP port" };

	return {
		account: { id: email.toLowerCase(), name: input.name?.trim() || email, email, pass, host, port, secure: port === 465 },
	};
}

export interface Recipient {
	email: string;
	name?: string;
}

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export const MAX_RECIPIENTS = 50;

/** Parses "a@x.com, Jane Doe <jane@x.com>" (commas, semicolons or newlines) into recipients. */
export function parseRecipients(input: string): { recipients: Recipient[]; invalid: string[] } {
	const recipients: Recipient[] = [];
	const invalid: string[] = [];
	const seen = new Set<string>();
	for (const part of input.split(/[,;\n]+/).map((p) => p.trim()).filter(Boolean)) {
		const match = part.match(/^(.*?)\s*<([^>]+)>$/);
		const email = (match ? match[2] : part).trim();
		const name = match ? match[1].replace(/^["']|["']$/g, "").trim() : undefined;
		if (!EMAIL_RE.test(email)) {
			invalid.push(part);
			continue;
		}
		const key = email.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		recipients.push({ email, name: name || undefined });
	}
	return { recipients, invalid };
}

/** Name used for the {{name}} / [name] variable: the display name, or the part of the address before the @. */
export function recipientFirstName(r: Recipient): string {
	const full = r.name || r.email.split("@")[0].replace(/[._-]+/g, " ");
	const first = full.trim().split(/\s+/)[0];
	return first ? first.charAt(0).toUpperCase() + first.slice(1) : "there";
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export function personalize(html: string, name: string): string {
	const safe = escapeHtml(name);
	return html.replace(/\{\{\s*name\s*\}\}/gi, safe).replace(/\[name\]/gi, safe);
}

/** Sending is open in development. In production it must be switched on explicitly, since the endpoint has no login. */
export const sendingEnabled = () => process.env.NODE_ENV !== "production" || process.env.ALLOW_SEND === "true";

export const MAX_BODY_BYTES = 2 * 1024 * 1024;
export const MAX_ITEMS = 500;

const hits = new Map<string, number[]>();

/** Simple in-memory sliding-window limiter. Returns false once `limit` requests were seen for `key` within `windowMs`. */
export function allowRequest(key: string, limit = 10, windowMs = 60_000, now = Date.now()): boolean {
	const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
	if (recent.length >= limit) {
		hits.set(key, recent);
		return false;
	}
	recent.push(now);
	hits.set(key, recent);
	return true;
}

export const clientKey = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
