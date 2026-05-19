import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import { type TemplateBlockConfig } from "@/config/blocks";

export function TemplateBlock({ type, label, icon, defaultProps }: TemplateBlockConfig) {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "TEMPLATE_BLOCK",
		item: { type, defaultProps },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	return (
		<div
			ref={drag as any}
			className={cn(
				"group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 bg-white shadow-sm cursor-grab hover:border-blue-200 hover:shadow-md transition-all duration-200",
				isDragging ? "opacity-40 grayscale" : "opacity-100"
			)}
		>
			<div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
				{icon}
			</div>
			<span className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-900 uppercase tracking-wider">{label}</span>
		</div>
	);
}
