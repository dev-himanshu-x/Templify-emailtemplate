import { MousePointer } from "lucide-react";
export function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[280px] text-center px-6 py-10">
			<div
				className="w-13 h-13 rounded-[14px] flex items-center justify-center mb-3.5 bg-gradient-to-br from-[#dbeafe] to-[#93c5fd] shadow-[0_8px_24px_rgba(37,99,235,0.25)]"
			>
				<MousePointer size={22} color="#2563eb" />
			</div>
			<p className="m-0 mb-1.5 text-sm font-bold text-gray-700">
				Start building your email
			</p>
			<p className="m-0 text-xs text-gray-400 leading-relaxed">
				Drag components onto the canvas
			</p>
		</div>
	);
}
