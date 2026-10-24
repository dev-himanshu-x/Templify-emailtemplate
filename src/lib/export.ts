import { type EmailSettings, normalizeSettings } from "@/config/email-settings";
import type { BuilderItem } from "@/types/builder";

/** Renders the template to email-safe HTML. Loaded lazily so the renderer stays out of the main bundle. */
export async function renderEmailHtml(items: BuilderItem[], settings?: EmailSettings): Promise<string> {
	const [{ render }, { EmailTemplate }, React] = await Promise.all([
		import("@react-email/render"),
		import("@/components/email/EmailTemplate"),
		import("react"),
	]);
	return render(React.createElement(EmailTemplate, { items, settings }));
}

export async function renderEmailText(items: BuilderItem[], settings?: EmailSettings): Promise<string> {
	const [{ render }, { EmailTemplate }, React] = await Promise.all([
		import("@react-email/render"),
		import("@/components/email/EmailTemplate"),
		import("react"),
	]);
	return render(React.createElement(EmailTemplate, { items, settings }), { plainText: true });
}

export async function copyToClipboard(text: string) {
	await navigator.clipboard.writeText(text);
}

export function downloadFile(filename: string, content: string, mime: string) {
	const url = URL.createObjectURL(new Blob([content], { type: mime }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

/** Parses an exported template file, returning null when it is not a valid item list. */
export function parseTemplateJson(raw: string): { items: BuilderItem[]; settings?: EmailSettings } | null {
	try {
		const data = JSON.parse(raw);
		const list = Array.isArray(data) ? data : data?.items;
		if (!Array.isArray(list)) return null;
		const valid = list.every((i) => i && typeof i.id === "string" && typeof i.type === "string" && i.props && typeof i.props === "object");
		if (!valid) return null;
		return { items: list as BuilderItem[], settings: Array.isArray(data) || !data.settings ? undefined : normalizeSettings(data.settings) };
	} catch {
		return null;
	}
}

export type CheckSeverity = "error" | "warning";
export interface CheckIssue {
	id: string;
	severity: CheckSeverity;
	message: string;
	itemId?: string;
}

/** Gmail clips messages whose HTML is larger than this. */
export const GMAIL_CLIP_BYTES = 102 * 1024;

const IMAGE_TYPES = new Set(["Img", "Banner", "Avatar"]);
const LINK_TYPES = new Set(["ButtonFull", "ButtonSplit", "ButtonAppStore", "Link"]);
const isPlaceholderLink = (href?: string) => !href || href === "#" || /^https?:\/\/(www\.)?example\.com\/?$/.test(href);

export function lintTemplate(items: BuilderItem[], settings?: EmailSettings): CheckIssue[] {
	const issues: CheckIssue[] = [];
	if (items.length === 0) {
		return [{ id: "empty", severity: "error", message: "The template is empty." }];
	}

	for (const item of items) {
		const label = item.type.replace(/([a-z])([A-Z])/g, "$1 $2");
		const { props } = item;

		if (IMAGE_TYPES.has(item.type)) {
			if (!props.imageAlt?.trim() && item.type !== "Avatar") {
				issues.push({ id: `${item.id}:alt`, severity: "warning", message: `${label} is missing alt text.`, itemId: item.id });
			}
			if (props.imageUrl?.startsWith("data:")) {
				issues.push({ id: `${item.id}:data`, severity: "warning", message: `${label} uses an inline data: image, which many clients block. Use a hosted https URL.`, itemId: item.id });
			} else if (props.imageUrl && !/^https:\/\//.test(props.imageUrl)) {
				issues.push({ id: `${item.id}:https`, severity: "warning", message: `${label} image is not served over https.`, itemId: item.id });
			}
		}

		if (LINK_TYPES.has(item.type) && isPlaceholderLink(props.href)) {
			issues.push({ id: `${item.id}:href`, severity: "warning", message: `${label} still has a placeholder link.`, itemId: item.id });
		}

		if ((item.type === "Heading" || item.type === "Text") && !props.text?.trim()) {
			issues.push({ id: `${item.id}:text`, severity: "warning", message: `${label} block is empty.`, itemId: item.id });
		}
	}

	if (settings) {
		const subject = settings.subject.trim();
		const preheader = settings.preheader.trim();
		if (!subject) {
			issues.push({ id: "subject", severity: "warning", message: "No subject line set (Email settings)." });
		} else if (subject.length > 60) {
			issues.push({ id: "subject-len", severity: "warning", message: `Subject is ${subject.length} characters. Over about 60 gets cut off in many inboxes.` });
		}
		if (!preheader) {
			issues.push({ id: "preheader", severity: "warning", message: "No preheader set, so inboxes will show text from the body instead." });
		} else if (preheader.length > 110) {
			issues.push({ id: "preheader-len", severity: "warning", message: `Preheader is ${preheader.length} characters. Keep it under about 110.` });
		}
	}

	const hasFooter = items.some((i) => i.type.startsWith("Footer"));
	if (!hasFooter) {
		issues.push({ id: "footer", severity: "warning", message: "No footer block. Marketing email needs a sender address and unsubscribe link." });
	}

	return issues;
}
