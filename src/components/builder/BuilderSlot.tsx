import { type CSSProperties, useMemo } from "react";
import { useDrop } from "react-dnd";
import { useBuilder } from "@/context/builder-context";
import { fontStack } from "@/config/email-settings";
import { cn } from "@/lib/utils";
import { BuilderBlock } from "./BuilderBlock";
import { EmptyState } from "./EmptyState";

export function BuilderSlot({ parentId, colIndex }: { parentId?: string; colIndex?: number }) {
	const { items, addItem, moveItem, viewMode, previewDark, settings } = useBuilder();

	const slotItems = useMemo(() => 
		items.filter(i => 
			(parentId === undefined ? i.parentId === undefined : i.parentId === parentId) && 
			(colIndex === undefined ? i.colIndex === undefined : i.colIndex === colIndex)
		),
		[items, parentId, colIndex]
	);

	const isRoot = parentId === undefined;
	const showDark = previewDark && settings.darkMode;

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
			style={isRoot ? ({ backgroundColor: showDark ? settings.darkPageBgColor : settings.pageBgColor, fontFamily: fontStack(settings.fontFamily), "--dark-text": settings.darkTextColor } as CSSProperties) : undefined}
			className={cn(
				"w-full transition-all duration-200 flex-auto shrink-0 flex flex-col rounded-[inherit] relative",
				isRoot ? (viewMode === 'mobile' ? "min-h-full" : "min-h-full py-4") : "p-2 min-h-full flex-row items-stretch gap-2 overflow-hidden",
				// Without dark colours set up, approximate a client's auto-inversion (images flipped back so photos keep their colours).
				isRoot && previewDark && !settings.darkMode ? "[filter:invert(1)_hue-rotate(180deg)] [&_img]:[filter:invert(1)_hue-rotate(180deg)]" : "",
				// With dark colours set up, show exactly what the email will use.
				isRoot && previewDark && settings.darkMode ? "[&_p]:![color:var(--dark-text)] [&_h1]:![color:var(--dark-text)] [&_h2]:![color:var(--dark-text)] [&_h3]:![color:var(--dark-text)] [&_h4]:![color:var(--dark-text)] [&_li]:![color:var(--dark-text)]" : "",
				isOver && isRoot ? "bg-blue-50/20" : "",
				isOver && !isRoot ? "bg-blue-50/50 ring-2 ring-blue-400 ring-inset" : "",
			)}
		>
			<div className={cn(
				"flex flex-col transition-all duration-300",
				isRoot ? "mx-auto w-full flex-auto shrink-0 min-h-full" : "gap-2 h-full flex-1",
				isRoot && viewMode === 'mobile' ? "max-w-full p-4" : isRoot ? "p-4" : "gap-2"
			)} style={isRoot ? { backgroundColor: showDark ? settings.darkContainerBgColor : settings.containerBgColor, maxWidth: viewMode === 'mobile' ? undefined : settings.maxWidth } : undefined}>
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
