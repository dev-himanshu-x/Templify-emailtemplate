import { useState } from "react";
import { useBuilder } from "@/context/builder-context";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet, Send } from "lucide-react";
import { cn, validateUrl } from "@/lib/utils";
import { contacts } from "@/lib/contacts";
import { toast } from "sonner";

export function TopBar() {
	const { items, viewMode, setViewMode, selectedRecipientEmail, setSelectedRecipientEmail } = useBuilder();
	const [isSending, setIsSending] = useState(false);

	const handleSendTest = () => {
		if (items.length === 0) return;
		setIsSending(true);
		
		fetch("/api/send-email", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items, to: selectedRecipientEmail }),
		})
			.then((res) => res.json())
			.then((result) => {
				if (result?.success) {
					toast.success(`Email sent to ${selectedRecipientEmail}!`);
				} else {
					const errorMsg = result?.error || "Failed to send";
					const phase = result?.phase ? `(${result.phase})` : "";
					toast.error(`${errorMsg} ${phase}`);
					console.error("Server Error Detail:", result);
				}
			})
			.catch(() => {
				toast.error("Error connecting to server");
			})
			.finally(() => {
				setIsSending(false);
			});
	};

	return (
		<div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
			<div className="flex items-center gap-6 w-1/3">
				<div className="flex items-center gap-2">
					<span className="font-bold text-gray-900 text-[15px]">Email Builder</span>
				</div>
			</div>
			
			<div className="flex items-center justify-center gap-6 w-1/3">
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
			</div>

			<div className="flex items-center justify-end gap-3 w-1/3">
				
				<div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5">
					<select 
						value={selectedRecipientEmail}
						onChange={(e) => setSelectedRecipientEmail(e.target.value)}
						className="bg-transparent text-[11px] font-medium text-gray-600 outline-none px-2 py-1 cursor-pointer hover:text-gray-900"
					>
						{contacts.map(contact => (
							<option key={contact.email} value={contact.email}>
								Preview for: {contact.name}
							</option>
						))}
					</select>
					
					<Button 
						className="h-7 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 ml-1 disabled:opacity-50"
						disabled={isSending || items.length === 0}
						onClick={handleSendTest}
					>
						{isSending ? (
							<div className="w-3 h-3 border-2 border-blue-200 border-t-white rounded-full animate-spin" />
						) : (
							<div className="flex items-center gap-1.5">
								<Send size={12} />
								<span>Send</span>
							</div>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
