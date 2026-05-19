import { useRef, useState, memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useBuilder } from "@/context/builder-context";
import type { BuilderItem } from "@/types/builder";
import { cn } from "@/lib/utils";
import { contacts } from "@/lib/contacts";
import { renderBlock } from "@/components/blocks";
import { BuilderSlot } from "./BuilderSlot";
import { BlockActions } from "./BlockActions";

const BuilderBlockComponent = ({ item, index }: { item: BuilderItem; index: number }) => {
	const { 
		selectedId, selectItem, selectItemOnly, removeItem, 
		moveItem, duplicateItem, addItem, updateItemProps, 
		setEditingMode, selectedRecipientEmail 
	} = useBuilder();
	
	const isSelected = selectedId === item.id;
	const [hovered, setHovered] = useState(false);
	const [isOverForSnippet, setIsOverForSnippet] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selectedRecipient = contacts.find(c => c.email === selectedRecipientEmail);

	const [{ isDragging }, drag, preview] = useDrag({
		type: "BUILDER_BLOCK",
		item: { id: item.id },
		collect: (monitor) => ({ isDragging: monitor.isDragging() })
	});

	const getTargetIndex = (monitor: any) => {
		if (!ref.current) return index;
		const hoverBoundingRect = ref.current.getBoundingClientRect();
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
		const clientOffset = monitor.getClientOffset();
		if (!clientOffset) return index;
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;
		return hoverClientY > hoverMiddleY ? index + 1 : index;
	};

	const [{ isOverCurrent, draggedType }, drop] = useDrop({
		accept: ["BUILDER_BLOCK", "TEMPLATE_BLOCK"],
		hover(dragged: any, monitor) {
			if (!ref.current || dragged.id === item.id || !monitor.isOver({ shallow: true })) return;

			const targetIndex = getTargetIndex(monitor);
			const isSnippetDrag = (dragged.type === 'CodeInline' || dragged.type === 'Link') && (item.type === 'Text' || item.type === 'Heading');
			setIsOverForSnippet(isSnippetDrag);

			if (dragged.id) {
				moveItem(dragged.id, item.parentId, item.colIndex, targetIndex);
			}
		},
		drop(dragged: any, monitor) {
			setIsOverForSnippet(false);
			if (monitor.didDrop()) return;

			const targetIndex = getTargetIndex(monitor);
			
			if ((dragged.type === 'CodeInline' || dragged.type === 'Link') && (item.type === 'Text' || item.type === 'Heading')) {
				const currentText = item.props.text || "";
				const insertion = dragged.type === 'CodeInline' 
					? ` \`${dragged.defaultProps?.text || 'snippet'}\``
					: ` [${dragged.defaultProps?.text || 'link'}](${dragged.defaultProps?.href || 'https://example.com'})`;

				updateItemProps(item.id, { text: (currentText + insertion).trim() });
				return;
			}

			if (dragged.type) {
				addItem(dragged.type, dragged.defaultProps, item.parentId, item.colIndex, targetIndex);
			}
		},
		collect: (monitor) => ({
			isOverCurrent: monitor.isOver({ shallow: true }),
			draggedType: monitor.getItemType()
		})
	});

	drag(drop(ref));

	return (
		<div
			ref={ref}
			onMouseLeave={() => { setHovered(false); setIsOverForSnippet(false); }}
			onClick={(e) => { e.stopPropagation(); selectItem(item.id); }}
			onMouseEnter={(e) => { e.stopPropagation(); setHovered(true); }}
			className={cn(
				"relative rounded-none cursor-pointer transition-all duration-200 group",
				isDragging ? "opacity-40 grayscale scale-[0.98] blur-[1px]" : "opacity-100",
				isSelected ? "ring-2 ring-blue-500 z-40" : hovered || isOverForSnippet ? "ring-1 ring-blue-200 z-20" : "z-10",
				isOverCurrent && draggedType === "TEMPLATE_BLOCK" ? "ring-2 ring-blue-400 z-50" : "",
				isOverForSnippet ? "bg-blue-50/30" : ""
			)}
		>
			{(isSelected || hovered) && !isDragging && (
				<BlockActions item={item} onDuplicate={duplicateItem} onRemove={removeItem} />
			)}
			<div className="bg-white rounded-none overflow-hidden relative">
				{renderBlock(
					item, 
					(colIndex) => <BuilderSlot parentId={item.id} colIndex={colIndex} />, 
					(type, value) => {
						selectItemOnly(item.id);
						setEditingMode({ 
							type: type === 'inline-link' ? 'inline-link' : 'inline-snippet',
							[type === 'inline-link' ? 'link' : 'snippet']: value 
						} as any);
					}, 
					selectedRecipient?.name
				)}
			</div>
		</div>
	);
};

export const BuilderBlock = memo(BuilderBlockComponent);
