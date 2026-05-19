import { Copy, GripVertical, Trash2 } from "lucide-react";
import type { BuilderItem } from "@/types/builder";

interface BlockActionsProps {
	item: BuilderItem;
	onDuplicate: (id: string) => void;
	onRemove: (id: string) => void;
}

export function BlockActions({ item, onDuplicate, onRemove }: BlockActionsProps) {
	return (
		<div className="absolute -top-3.5 right-2 flex gap-1 z-30">
			<div className="h-5 rounded-full bg-blue-600 flex items-center px-2 text-white text-[9px] font-bold ">
				{item.type}
			</div>
			<div
				className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-grab text-gray-400  hover:text-blue-600"
			>
				<GripVertical size={10} />
			</div>
			<button
				onClick={(e) => { e.stopPropagation(); onDuplicate(item.id); }}
				className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400  hover:text-blue-600 transition-colors"
			>
				<Copy size={9} />
			</button>
			<button
				onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
				className="w-5 h-5 rounded-full bg-white border border-red-100 flex items-center justify-center text-red-400  hover:bg-red-50 transition-colors"
			>
				<Trash2 size={9} />
			</button>
		</div>
	);
}
