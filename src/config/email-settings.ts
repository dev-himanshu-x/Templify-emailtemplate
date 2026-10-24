export interface EmailSettings {
	subject: string;
	preheader: string;
	/** Colour behind the email container. */
	pageBgColor: string;
	/** Colour of the email container itself. */
	containerBgColor: string;
	/** Container width in px on desktop. */
	maxWidth: number;
	fontFamily: string;
	/** Ship dark-mode colours. When off, the email asks clients to stay in light mode. */
	darkMode: boolean;
	darkPageBgColor: string;
	darkContainerBgColor: string;
	/** Applied to paragraphs, headings and list items in dark mode. */
	darkTextColor: string;
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
	subject: "",
	preheader: "",
	pageBgColor: "#f4f4f7",
	containerBgColor: "#ffffff",
	maxWidth: 600,
	fontFamily: "system",
	darkMode: false,
	darkPageBgColor: "#111827",
	darkContainerBgColor: "#1f2937",
	darkTextColor: "#f3f4f6",
};

/** Email-safe font stacks, keyed by the value stored in settings. */
export const FONT_STACKS: Record<string, { label: string; stack: string }> = {
	system: { label: "System sans-serif", stack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
	arial: { label: "Arial", stack: "Arial, Helvetica, sans-serif" },
	georgia: { label: "Georgia (serif)", stack: "Georgia, 'Times New Roman', serif" },
	verdana: { label: "Verdana", stack: "Verdana, Geneva, sans-serif" },
	trebuchet: { label: "Trebuchet MS", stack: "'Trebuchet MS', Helvetica, sans-serif" },
	courier: { label: "Courier (mono)", stack: "'Courier New', Courier, monospace" },
};

export const fontStack = (key: string) => (FONT_STACKS[key] ?? FONT_STACKS.system).stack;

/** Fills in any missing fields, so older saved data keeps working. */
export const normalizeSettings = (raw: unknown): EmailSettings => ({ ...DEFAULT_EMAIL_SETTINGS, ...(typeof raw === "object" && raw ? raw : {}) });
