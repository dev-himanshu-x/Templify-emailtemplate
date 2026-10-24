import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useBuilder } from "@/context/builder-context";
import { Button } from "@/components/ui/button";
import {
	AlertTriangle,
	CheckCircle2,
	ChevronDown,
	ClipboardCopy,
	Download,
	FileJson,
	FileText,
	LayoutTemplate,
	Monitor,
	Moon,
	Copy,
	FlaskConical,
	Pencil,
	Save,
	Trash2,
	Redo2,
	Send,
	Smartphone,
	Sun,
	Tablet,
	Undo2,
	Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SendDialog } from "./SendDialog";
import { getLastSender, rememberSender, sendEmail, senderEmail } from "@/lib/send-client";
import { templateLibrary, type SavedTemplate } from "@/lib/library";
import { toast } from "sonner";
import { instantiateTemplate, STARTER_TEMPLATES } from "@/config/starter-templates";
import {
	copyToClipboard,
	downloadFile,
	GMAIL_CLIP_BYTES,
	lintTemplate,
	parseTemplateJson,
	renderEmailHtml,
	renderEmailText,
} from "@/lib/export";

function Menu({ label, icon, badge, children, align = "right" }: { label: string; icon: ReactNode; badge?: ReactNode; children: (close: () => void) => ReactNode; align?: "left" | "right" }) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
		document.addEventListener("mousedown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	return (
		<div ref={ref} className="relative">
			<Button variant="ghost" className="h-8 gap-1.5 px-2.5 text-[12px] font-medium text-gray-700" onClick={() => setOpen((o) => !o)}>
				{icon}
				<span>{label}</span>
				{badge}
				<ChevronDown size={12} className="text-gray-400" />
			</Button>
			{open && (
				<div className={cn("absolute top-full mt-1 z-50 w-72 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl", align === "right" ? "right-0" : "left-0")}>
					{children(() => setOpen(false))}
				</div>
			)}
		</div>
	);
}

function MenuItem({ icon, title, hint, onClick, disabled }: { icon: ReactNode; title: string; hint?: string; onClick: () => void; disabled?: boolean }) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
		>
			<span className="mt-0.5 text-gray-500">{icon}</span>
			<span className="min-w-0">
				<span className="block text-[12px] font-medium text-gray-900">{title}</span>
				{hint && <span className="block text-[11px] text-gray-400">{hint}</span>}
			</span>
		</button>
	);
}

const timeAgo = (ts: number) => {
	const mins = Math.round((Date.now() - ts) / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins} min ago`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours} h ago`;
	return new Date(ts).toLocaleDateString();
};

function IconButton({ title, onClick, danger, children }: { title: string; onClick: () => void; danger?: boolean; children: ReactNode }) {
	return (
		<button
			type="button"
			title={title}
			aria-label={title}
			onClick={onClick}
			className={cn("rounded p-1 text-gray-400 hover:bg-gray-100", danger ? "hover:text-red-500" : "hover:text-blue-600")}
		>
			{children}
		</button>
	);
}

const formatKb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

export function TopBar() {
	const { items, settings, viewMode, setViewMode, previewDark, setPreviewDark, undo, redo, canUndo, canRedo, replaceItems, selectItem } = useBuilder();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [htmlSize, setHtmlSize] = useState<number | null>(null);
	const [sendOpen, setSendOpen] = useState<false | "send" | "test">(false);
	const [testSending, setTestSending] = useState(false);
	const isEmpty = items.length === 0;

	const savedTemplates = templateLibrary.useEntries();

	/** One click when a sender was already used this session, otherwise opens the dialog in test mode. */
	const sendTest = async () => {
		const last = getLastSender();
		if (!last) {
			setSendOpen("test");
			return;
		}
		if (!settings.subject.trim()) {
			toast.error("Add a subject line in Email settings first");
			return;
		}
		setTestSending(true);
		const to = senderEmail(last);
		const result = await sendEmail({ items, settings, sender: last, to, subjectPrefix: "[TEST] " });
		setTestSending(false);
		if (result.success) {
			rememberSender(last);
			toast.success(`Test sent to ${to}`);
		} else {
			toast.error(result.error ?? "Failed to send the test");
		}
	};

	const saveFailed = () => toast.error("Couldn't save. Browser storage is full or blocked.");

	const saveAsNew = () => {
		const name = window.prompt("Name this template", settings.subject.trim() || "Untitled template")?.trim();
		if (!name) return;
		const ok = templateLibrary.add({ id: crypto.randomUUID(), name, updatedAt: Date.now(), items, settings });
		ok ? toast.success(`Saved "${name}"`) : saveFailed();
	};

	const loadSaved = (t: SavedTemplate) => {
		if (!confirmReplace()) return;
		replaceItems(t.items, t.settings);
		toast.success(`Loaded "${t.name}"`);
	};

	const overwriteSaved = (t: SavedTemplate) => {
		if (!window.confirm(`Replace "${t.name}" with the current template?`)) return;
		const ok = templateLibrary.update(t.id, { items, settings, updatedAt: Date.now() });
		ok ? toast.success(`Updated "${t.name}"`) : saveFailed();
	};

	const renameSaved = (t: SavedTemplate) => {
		const name = window.prompt("Rename template", t.name)?.trim();
		if (name) templateLibrary.update(t.id, { name });
	};

	const duplicateSaved = (t: SavedTemplate) => {
		const ok = templateLibrary.add({ ...t, id: crypto.randomUUID(), name: `${t.name} copy`, updatedAt: Date.now() });
		if (!ok) saveFailed();
	};

	const deleteSaved = (t: SavedTemplate) => {
		if (window.confirm(`Delete "${t.name}"? This can't be undone.`)) templateLibrary.remove(t.id);
	};

	const issues = useMemo(() => lintTemplate(items, settings), [items, settings]);
	const warningCount = issues.length;

	const withRendered = async (kind: "html" | "text", action: (content: string) => void | Promise<void>) => {
		try {
			const content = kind === "html" ? await renderEmailHtml(items, settings) : await renderEmailText(items, settings);
			await action(content);
		} catch (err) {
			console.error(err);
			toast.error("Couldn't export the template");
		}
	};

	const confirmReplace = () => isEmpty || window.confirm("Replace the current template? You can undo this afterwards.");

	const handleImport = (file: File) => {
		file.text().then((raw) => {
			const parsed = parseTemplateJson(raw);
			if (!parsed) {
				toast.error("That file isn't a valid template");
				return;
			}
			if (!confirmReplace()) return;
			replaceItems(parsed.items, parsed.settings);
			toast.success("Template imported");
		});
	};

	const measureSize = (open: boolean) => {
		if (open && !isEmpty) renderEmailHtml(items, settings).then((html) => setHtmlSize(new Blob([html]).size)).catch(() => setHtmlSize(null));
	};

	return (
		<div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
			<div className="flex items-center gap-2 w-1/3">
				<span className="font-bold text-gray-900 text-[15px] mr-3">Email Builder</span>
				<Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canUndo} onClick={undo} title="Undo (⌘Z)" aria-label="Undo">
					<Undo2 size={15} />
				</Button>
				<Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canRedo} onClick={redo} title="Redo (⇧⌘Z)" aria-label="Redo">
					<Redo2 size={15} />
				</Button>
				<Menu label="Templates" icon={<LayoutTemplate size={14} />} align="left">
					{(close) => (
						<>
							<div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Starter templates</div>
							{STARTER_TEMPLATES.map((t) => (
								<MenuItem
									key={t.id}
									icon={<LayoutTemplate size={14} />}
									title={t.name}
									hint={t.description}
									onClick={() => {
										close();
										if (!confirmReplace()) return;
										replaceItems(instantiateTemplate(t));
									}}
								/>
							))}
							<div className="my-1 border-t border-gray-100" />
							<div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">My templates</div>
							<MenuItem
								icon={<Save size={14} />}
								title="Save current as new template…"
								disabled={isEmpty}
								onClick={() => {
									close();
									saveAsNew();
								}}
							/>
							{savedTemplates.length === 0 && <p className="px-2.5 py-2 text-[11px] text-gray-400">Nothing saved yet.</p>}
							<div className="max-h-56 overflow-y-auto">
								{savedTemplates.map((t) => (
									<div key={t.id} className="flex items-center gap-1 rounded-md pr-1.5 hover:bg-gray-50">
										<button
											type="button"
											onClick={() => {
												close();
												loadSaved(t);
											}}
											className="min-w-0 flex-1 px-2.5 py-2 text-left"
										>
											<span className="block truncate text-[12px] font-medium text-gray-900">{t.name}</span>
											<span className="block text-[11px] text-gray-400">{t.items.length} blocks · {timeAgo(t.updatedAt)}</span>
										</button>
										<IconButton title="Replace with current template" onClick={() => overwriteSaved(t)}><Save size={12} /></IconButton>
										<IconButton title="Rename" onClick={() => renameSaved(t)}><Pencil size={12} /></IconButton>
										<IconButton title="Duplicate" onClick={() => duplicateSaved(t)}><Copy size={12} /></IconButton>
										<IconButton title="Delete" danger onClick={() => deleteSaved(t)}><Trash2 size={12} /></IconButton>
									</div>
								))}
							</div>
						</>
					)}
				</Menu>
			</div>

			<div className="flex items-center justify-center gap-3 w-1/3">
				<div className="flex items-center gap-1 bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/50">
					<Button
						variant={viewMode === "laptop" ? "secondary" : "ghost"}
						size="icon"
						className={cn("h-7 w-7 rounded-md", viewMode === "laptop" ? "bg-white shadow-sm" : "")}
						onClick={() => setViewMode("laptop")}
					>
						<Monitor size={14} className={viewMode === "laptop" ? "text-gray-900" : "text-gray-500"} />
					</Button>
					<Button
						variant={viewMode === "tablet" ? "secondary" : "ghost"}
						size="icon"
						className={cn("h-7 w-7 rounded-md", viewMode === "tablet" ? "bg-white shadow-sm" : "")}
						onClick={() => setViewMode("tablet")}
					>
						<Tablet size={14} className={viewMode === "tablet" ? "text-gray-900" : "text-gray-500"} />
					</Button>
					<Button
						variant={viewMode === "mobile" ? "secondary" : "ghost"}
						size="icon"
						className={cn("h-7 w-7 rounded-md", viewMode === "mobile" ? "bg-white shadow-sm" : "")}
						onClick={() => setViewMode("mobile")}
					>
						<Smartphone size={14} className={viewMode === "mobile" ? "text-gray-900" : "text-gray-500"} />
					</Button>
				</div>
				<Button
					variant={previewDark ? "secondary" : "ghost"}
					size="icon"
					className="h-8 w-8"
					onClick={() => setPreviewDark(!previewDark)}
					title={previewDark ? "Switch to light preview" : "Preview with dark-mode inversion"}
					aria-label="Toggle dark-mode preview"
				>
					{previewDark ? <Sun size={15} /> : <Moon size={15} />}
				</Button>
			</div>

			<div className="flex items-center justify-end gap-1 w-1/3">
				<Menu
					label="Checks"
					icon={warningCount === 0 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
					badge={warningCount > 0 ? <span className="rounded-full bg-amber-100 px-1.5 text-[10px] font-bold text-amber-700">{warningCount}</span> : undefined}
				>
					{() => <ChecksPanel issues={issues} isEmpty={isEmpty} htmlSize={htmlSize} onOpen={() => measureSize(true)} onFocusItem={selectItem} />}
				</Menu>
				<Menu label="Export" icon={<Download size={14} />}>
					{(close) => (
						<>
							<MenuItem
								icon={<ClipboardCopy size={14} />}
								title="Copy HTML"
								hint="Paste into your email service"
								disabled={isEmpty}
								onClick={() => {
									close();
									withRendered("html", async (html) => {
										await copyToClipboard(html);
										toast.success("HTML copied to clipboard");
									});
								}}
							/>
							<MenuItem
								icon={<Download size={14} />}
								title="Download .html"
								disabled={isEmpty}
								onClick={() => {
									close();
									withRendered("html", (html) => downloadFile("email-template.html", html, "text/html"));
								}}
							/>
							<MenuItem
								icon={<ClipboardCopy size={14} />}
								title="Copy subject line"
								hint={settings.subject || "Set one in Email settings"}
								disabled={!settings.subject.trim()}
								onClick={() => {
									close();
									copyToClipboard(settings.subject).then(() => toast.success("Subject copied to clipboard"));
								}}
							/>
							<MenuItem
								icon={<FileText size={14} />}
								title="Copy plain-text version"
								hint="For the text/plain part of the message"
								disabled={isEmpty}
								onClick={() => {
									close();
									withRendered("text", async (text) => {
										await copyToClipboard(text);
										toast.success("Plain text copied to clipboard");
									});
								}}
							/>
							<div className="my-1 border-t border-gray-100" />
							<MenuItem
								icon={<FileJson size={14} />}
								title="Save template as JSON"
								hint="Re-import it later or share it"
								disabled={isEmpty}
								onClick={() => {
									close();
									downloadFile("email-template.json", JSON.stringify({ version: 2, settings, items }, null, 2), "application/json");
								}}
							/>
							<MenuItem
								icon={<Upload size={14} />}
								title="Import JSON"
								onClick={() => {
									close();
									fileInputRef.current?.click();
								}}
							/>
						</>
					)}
				</Menu>
				<Button variant="ghost" className="ml-1 h-8 gap-1.5 px-2.5 text-[12px] font-medium text-gray-700" disabled={isEmpty || testSending} onClick={sendTest} title="Email a copy to the sender address, with [TEST] in the subject">
					<FlaskConical size={13} />
					{testSending ? "Sending…" : "Send test"}
				</Button>
				<Button className="h-8 gap-1.5 bg-blue-600 px-3 text-[12px] font-bold text-white hover:bg-blue-700" disabled={isEmpty} onClick={() => setSendOpen("send")}>
					<Send size={13} />
					Send
				</Button>
				{sendOpen && <SendDialog testMode={sendOpen === "test"} onClose={() => setSendOpen(false)} />}
				<input
					ref={fileInputRef}
					type="file"
					accept="application/json,.json"
					className="hidden"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) handleImport(file);
						e.target.value = "";
					}}
				/>
			</div>
		</div>
	);
}

function ChecksPanel({ issues, isEmpty, htmlSize, onOpen, onFocusItem }: { issues: ReturnType<typeof lintTemplate>; isEmpty: boolean; htmlSize: number | null; onOpen: () => void; onFocusItem: (id: string) => void }) {
	useEffect(onOpen, []); // eslint-disable-line react-hooks/exhaustive-deps
	const tooLarge = htmlSize !== null && htmlSize > GMAIL_CLIP_BYTES;

	return (
		<div className="max-h-80 overflow-y-auto">
			{!isEmpty && htmlSize !== null && (
				<div className={cn("mx-1 mb-1 rounded-md px-2.5 py-2 text-[11px]", tooLarge ? "bg-amber-50 text-amber-800" : "bg-gray-50 text-gray-600")}>
					HTML size: <span className="font-semibold">{formatKb(htmlSize)}</span>
					{tooLarge ? ". Gmail clips messages over 102 KB." : " (Gmail clips at 102 KB)."}
				</div>
			)}
			{issues.length === 0 ? (
				<div className="flex items-center gap-2 px-2.5 py-3 text-[12px] text-emerald-700">
					<CheckCircle2 size={14} /> No issues found.
				</div>
			) : (
				issues.map((issue) => (
					<button
						key={issue.id}
						type="button"
						disabled={!issue.itemId}
						onClick={() => issue.itemId && onFocusItem(issue.itemId)}
						className="flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left hover:bg-gray-50 disabled:hover:bg-transparent"
					>
						<AlertTriangle size={13} className={cn("mt-0.5 shrink-0", issue.severity === "error" ? "text-red-500" : "text-amber-500")} />
						<span className="text-[12px] text-gray-700">{issue.message}</span>
					</button>
				))
			)}
		</div>
	);
}
