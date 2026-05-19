import { useMemo } from "react";
import { useDrop } from "react-dnd";
import { useBuilder } from "@/context/builder-context";
import { cn } from "@/lib/utils";
import { BuilderBlock } from "./BuilderBlock";
import { EmptyState } from "./EmptyState";

export function BuilderSlot({ parentId, colIndex }: { parentId?: string; colIndex?: number }) {
	const { items, addItem, moveItem, viewMode } = useBuilder();

	const slotItems = useMemo(() => 
		items.filter(i => 
			(parentId === undefined ? i.parentId === undefined : i.parentId === parentId) && 
			(colIndex === undefined ? i.colIndex === undefined : i.colIndex === colIndex)
		),
		[items, parentId, colIndex]
	);

	const isRoot = parentId === undefined;

	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: ["TEMPLATE_BLOCK", "BUILDER_BLOCK"],
			hover: (dragged: any) => {
				if (dragged.id) {
					moveItem(dragged.id, parentId, colIndex, slotItems.length);
				}
			},
			drop: (dragged: any, monitor) => {
				if (monitor.didDrop()) return;
				if (dragged.type) {
					addItem(dragged.type, dragged.defaultProps, parentId, colIndex, slotItems.length);
				}
			},
			collect: (m) => ({ isOver: m.isOver() }),
		}),
		[addItem, moveItem, parentId, colIndex, slotItems.length],
	);

	return (
		<div
			ref={drop as any}
			className={cn(
				"w-full transition-all duration-200 flex-1 flex flex-col rounded-[inherit] relative",
				isRoot ? (viewMode === 'mobile' ? "min-h-full" : "min-h-full py-4") : "p-2 min-h-full flex-row items-stretch gap-2 overflow-hidden",
				isOver && isRoot ? "bg-blue-50/20" : "",
				isOver && !isRoot ? "bg-blue-50/50 ring-2 ring-blue-400 ring-inset" : "",
			)}
		>
			<div className={cn(
				"flex flex-col transition-all duration-300",
				isRoot ? "bg-white mx-auto w-full flex-1 min-h-full" : "gap-2 h-full flex-1",
				isRoot && viewMode === 'mobile' ? "max-w-full p-4" : isRoot ? "max-w-[600px] p-4" : "gap-2"
			)}>
				{slotItems.length === 0 && isRoot && (
					<EmptyState />
				)}
				{slotItems.length === 0 && !isRoot && !isOver && (
					<div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-none text-gray-400 text-[10px] uppercase tracking-wider font-bold p-8">
						Drop here
					</div>
				)}
				{slotItems.map((item, index) => (
					<div key={item.id} className={!isRoot ? "flex-1 min-w-0" : "w-full"}>
						<BuilderBlock item={item} index={index} />
					</div>
				))}
			</div>
		</div>
	);
}
