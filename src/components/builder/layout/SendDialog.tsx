import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/context/builder-context";
import { rememberSender, type SenderChoice, type SenderForm, sendEmail, senderEmail } from "@/lib/send-client";

interface SendersResponse {
	senders: ServerSender[];
	disabled?: boolean;
}

interface ServerSender {
	id: string;
	name: string;
	email: string;
}

const CUSTOM = "__custom__";
const SENDER_KEY = "email-builder:sender";
const RECIPIENTS_KEY = "email-builder:recipients";
const EMPTY_SENDER: SenderForm = { name: "", email: "", host: "", port: "" };

const readJson = <T,>(key: string, fallback: T): T => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
};
const writeJson = (key: string, value: unknown) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage can be blocked; the dialog still works without it.
	}
};

const inputClass = "w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs text-gray-900 focus:outline-none";
const labelClass = "text-[10px] font-bold uppercase tracking-wider text-gray-400";

export function SendDialog({ onClose, testMode = false }: { onClose: () => void; testMode?: boolean }) {
	const { items, settings } = useBuilder();
	const [serverSenders, setServerSenders] = useState<ServerSender[] | null>(null);
	const [disabled, setDisabled] = useState(false);
	const [choice, setChoice] = useState(CUSTOM);
	// The password is deliberately kept in memory only and never written to storage.
	const [sender, setSender] = useState<SenderForm>(() => readJson(SENDER_KEY, EMPTY_SENDER));
	const [pass, setPass] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [to, setTo] = useState(() => readJson(RECIPIENTS_KEY, ""));
	const toRef = useRef<HTMLTextAreaElement>(null);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/senders")
			.then((res) => res.json())
			.then((data: SendersResponse) => {
				setServerSenders(data.senders);
				setDisabled(Boolean(data.disabled));
				if (data.senders.length > 0) setChoice(data.senders[0].id);
			})
			.catch(() => setServerSenders([]));
	}, []);

	// Grow the recipients box with its content, from one line up to a cap.
	useLayoutEffect(() => {
		const el = toRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
	}, [to, serverSenders]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && !sending && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose, sending]);

	const usingCustom = choice === CUSTOM;
	const subjectMissing = !settings.subject.trim();
	const senderReady = usingCustom ? sender.email.trim() !== "" && pass !== "" : choice !== "";
	const canSend = !sending && !disabled && !subjectMissing && senderReady && (testMode || to.trim().length > 0);

	const updateSender = (patch: Partial<SenderForm>) => setSender((prev) => ({ ...prev, ...patch }));

	const currentChoice = (): SenderChoice => {
		if (usingCustom) return { kind: "custom", sender, pass };
		const server = serverSenders?.find((x) => x.id === choice);
		return { kind: "server", id: choice, email: server?.email ?? "" };
	};

	const handleSend = async () => {
		setSending(true);
		setError(null);
		const senderChoice = currentChoice();
		const recipients = testMode ? senderEmail(senderChoice) : to;
		const result = await sendEmail({ items, settings, sender: senderChoice, to: recipients, subjectPrefix: testMode ? "[TEST] " : undefined });
		setSending(false);

		if (!result.success) {
			setError(result.error ?? "Failed to send");
			return;
		}
		rememberSender(senderChoice);
		if (usingCustom) writeJson(SENDER_KEY, sender);
		if (!testMode) writeJson(RECIPIENTS_KEY, to);
		if (result.failed?.length) {
			toast.warning(`Sent to ${result.sent}, failed for ${result.failed.map((f) => f.email).join(", ")}`);
		} else if (testMode) {
			toast.success(`Test sent to ${recipients}`);
		} else {
			toast.success(`Email sent to ${result.sent} recipient${result.sent === 1 ? "" : "s"}`);
		}
		onClose();
	};

	// Portal to <body> so the dialog escapes the top bar's stacking context and covers the device frames.
	return createPortal(
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && !sending && onClose()}>
			<div role="dialog" aria-modal="true" aria-label="Send email" className="flex max-h-[90vh] w-full max-w-md flex-col rounded-xl bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
					<h2 className="text-sm font-bold text-gray-900">{testMode ? "Send a test to yourself" : "Send email"}</h2>
					<button type="button" onClick={onClose} disabled={sending} aria-label="Close" className="text-gray-400 hover:text-gray-700">
						<X size={16} />
					</button>
				</div>

				<form
					className="space-y-4 overflow-y-auto px-5 py-4"
					onSubmit={(e) => {
						e.preventDefault();
						if (canSend) handleSend();
					}}
				>
					{serverSenders === null ? (
						<div className="flex items-center gap-2 text-xs text-gray-400">
							<Loader2 size={14} className="animate-spin" /> Loading…
						</div>
					) : disabled ? (
						<div className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
							Sending is turned off on this server. Set <code className="font-mono">ALLOW_SEND=true</code> to enable it.
						</div>
					) : (
						<>
							{serverSenders.length > 0 && (
								<label className="block space-y-1.5">
									<span className={labelClass}>From account</span>
									<select value={choice} onChange={(e) => setChoice(e.target.value)} className={inputClass}>
										{serverSenders.map((s) => (
											<option key={s.id} value={s.id}>
												{s.name === s.email ? s.email : `${s.name} <${s.email}>`}
											</option>
										))}
										<option value={CUSTOM}>Use a different account…</option>
									</select>
								</label>
							)}

							{usingCustom && (
								<div className="space-y-3 rounded-lg border border-gray-100 p-3">
									<label className="block space-y-1.5">
										<span className={labelClass}>Your name</span>
										<input type="text" autoComplete="name" value={sender.name} onChange={(e) => updateSender({ name: e.target.value })} placeholder="Acme Team" className={inputClass} />
									</label>
									<label className="block space-y-1.5">
										<span className={labelClass}>Your email</span>
										<input type="email" autoComplete="email" value={sender.email} onChange={(e) => updateSender({ email: e.target.value })} placeholder="you@gmail.com" className={inputClass} />
									</label>
									<label className="block space-y-1.5">
										<span className={labelClass}>App password</span>
										<div className="relative">
											<input
												type={showPass ? "text" : "password"}
												autoComplete="off"
												value={pass}
												onChange={(e) => setPass(e.target.value)}
												placeholder="16-character app password"
												className={`${inputClass} pr-9`}
											/>
											<button type="button" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
												{showPass ? <EyeOff size={14} /> : <Eye size={14} />}
											</button>
										</div>
										<span className="block text-[11px] leading-relaxed text-gray-400">
											Gmail needs an{" "}
											<a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-blue-600 underline">
												app password
											</a>
											, not your normal password. It's sent only to your own server to log in and is never saved in this browser.
										</span>
									</label>
									<details className="text-xs text-gray-500">
										<summary className="cursor-pointer select-none text-[11px] font-medium">Advanced: SMTP server</summary>
										<div className="mt-2 grid grid-cols-3 gap-2">
											<input type="text" value={sender.host} onChange={(e) => updateSender({ host: e.target.value })} placeholder="smtp.example.com" aria-label="SMTP host" className={`${inputClass} col-span-2`} />
											<input type="number" value={sender.port} onChange={(e) => updateSender({ port: e.target.value })} placeholder="465" aria-label="SMTP port" className={inputClass} />
										</div>
										<p className="mt-1.5 text-[11px] text-gray-400">Leave blank for Gmail, Outlook, Yahoo and iCloud. Other providers need a host.</p>
									</details>
								</div>
							)}

							{testMode ? (
								<p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">The test goes to the sender address above, with <span className="font-semibold">[TEST]</span> added to the subject.</p>
							) : (
							<label className="block space-y-1.5">
								<span className={labelClass}>To</span>
								<textarea ref={toRef} value={to} onChange={(e) => setTo(e.target.value)} rows={1} placeholder={"jane@example.com, Sam Lee <sam@example.com>"} className={`${inputClass} max-h-[120px] resize-none overflow-y-auto`} />
								<span className="block text-[11px] text-gray-400">
									Separate addresses with commas or new lines. Each person gets their own copy, and <code className="font-mono">{"{{name}}"}</code> is filled in per recipient.
								</span>
							</label>
							)}

							<div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
								<span className="font-semibold">Subject: </span>
								{subjectMissing ? <span className="text-amber-600">not set. Add one in Email settings (deselect any block to see them).</span> : settings.subject}
							</div>
						</>
					)}

					{error && <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</div>}
					<button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
				</form>

				<div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
					<Button variant="ghost" className="h-8 text-xs" onClick={onClose} disabled={sending}>
						Cancel
					</Button>
					<Button className="h-8 gap-1.5 bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50" disabled={!canSend} onClick={handleSend}>
						{sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
						{sending ? "Sending…" : testMode ? "Send test" : "Send"}
					</Button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
