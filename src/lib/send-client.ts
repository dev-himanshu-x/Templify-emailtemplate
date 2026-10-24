import type { EmailSettings } from "@/config/email-settings";
import type { BuilderItem } from "@/types/builder";

export interface SenderForm {
	name: string;
	email: string;
	host: string;
	port: string;
}

/** Either an account typed into the dialog or one configured on the server. */
export type SenderChoice = { kind: "custom"; sender: SenderForm; pass: string } | { kind: "server"; id: string; email: string };

export interface SendResult {
	success: boolean;
	sent?: number;
	failed?: { email: string; error: string }[];
	error?: string;
}

/**
 * The sender used last in this tab. It lives in memory only, so a page reload forgets it
 * and the password is never written to storage.
 */
let lastSender: SenderChoice | null = null;
export const getLastSender = () => lastSender;
export const rememberSender = (choice: SenderChoice) => {
	lastSender = choice;
};

export const senderEmail = (choice: SenderChoice) => (choice.kind === "custom" ? choice.sender.email.trim() : choice.email);

export async function sendEmail(args: { items: BuilderItem[]; settings: EmailSettings; sender: SenderChoice; to: string; subjectPrefix?: string }): Promise<SendResult> {
	try {
		const res = await fetch("/api/send-email", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				items: args.items,
				settings: args.settings,
				to: args.to,
				subjectPrefix: args.subjectPrefix,
				...(args.sender.kind === "custom" ? { sender: { ...args.sender.sender, pass: args.sender.pass } } : { senderId: args.sender.id }),
			}),
		});
		return (await res.json()) as SendResult;
	} catch {
		return { success: false, error: "Couldn't reach the server" };
	}
}
