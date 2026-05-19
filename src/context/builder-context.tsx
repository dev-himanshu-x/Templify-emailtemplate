import { createContext, type ReactNode, useContext, useState, useCallback, useMemo } from "react";
import { contacts } from "@/lib/contacts";
import { defaultPropsForType } from "@/config/builder-defaults";
import { generateId } from "@/lib/builder-utils";
import type {
	BuilderContextType,
	BuilderItem,
	BuilderItemProps,
	ItemType,
} from "@/types/builder";

const BuilderContext = createContext<BuilderContextType | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<BuilderItem[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"mobile" | "tablet" | "laptop">("laptop");
	const [showCode, setShowCode] = useState(false);
	const [selectedRecipientEmail, setSelectedRecipientEmail] = useState(contacts[0].email);
	const [editingMode, setEditingMode] = useState<BuilderContextType['editingMode']>({ type: 'block' });

	const addItem = useCallback((type: ItemType, extraProps?: Partial<BuilderItemProps>, parentId?: string, colIndex?: number, indexInCol?: number) => {
		const id = generateId();
		const newItem: BuilderItem = {
			id,
			type,
			parentId,
			colIndex,
			props: { ...defaultPropsForType(type), ...extraProps },
		};

		setItems((prev) => {
			const newItems = [...prev];
			if (indexInCol !== undefined) {
				const siblings = newItems.filter(i => i.parentId === parentId && i.colIndex === colIndex);
				const insertBeforeId = siblings[indexInCol]?.id;
				if (insertBeforeId) {
					const targetIndex = newItems.findIndex(i => i.id === insertBeforeId);
					newItems.splice(targetIndex, 0, newItem);
					return newItems;
				}
			}
			return [...newItems, newItem];
		});

		setSelectedId(id);
		return id;
	}, []);

	const removeItem = useCallback((id: string) => {
		const getDescendants = (parentId: string, allItems: BuilderItem[]): string[] => {
			const children = allItems.filter(i => i.parentId === parentId);
			return [...children.map(c => c.id), ...children.flatMap(c => getDescendants(c.id, allItems))];
		};

		setItems((prev) => {
			const toRemove = new Set([id, ...getDescendants(id, prev)]);
			return prev.filter(i => !toRemove.has(i.id));
		});

		setSelectedId((prev) => (prev === id ? null : prev));
	}, []);

	const selectItem = useCallback((id: string | null) => {
		setSelectedId(id);
		setEditingMode({ type: 'block' });
	}, []);

	const selectItemOnly = useCallback((id: string | null) => {
		setSelectedId(id);
	}, []);

	const updateItemProps = useCallback((id: string, props: Partial<BuilderItemProps>) => {
		setItems((prev) =>
			prev.map((i) =>
				i.id === id ? { ...i, props: { ...i.props, ...props } } : i,
			),
		);
	}, []);

	const moveItem = useCallback((id: string, toParentId: string | undefined, toColIndex: number | undefined, toIndex: number) => {
		setItems((prev) => {
			const itemIndex = prev.findIndex(i => i.id === id);
			if (itemIndex === -1) return prev;
			
			const currentItem = prev[itemIndex];
			const siblings = prev.filter(i => i.parentId === toParentId && i.colIndex === toColIndex);
			const currentIndex = siblings.findIndex(i => i.id === id);
			
			// If moving within the same slot to the same index, skip
			if (currentItem.parentId === toParentId && currentItem.colIndex === toColIndex && currentIndex === toIndex) {
				return prev;
			}

			const item = { ...currentItem, parentId: toParentId, colIndex: toColIndex };
			const newItems = prev.filter(i => i.id !== id);
			
			const newSiblings = newItems.filter(i => i.parentId === toParentId && i.colIndex === toColIndex);
			const insertBeforeId = newSiblings[toIndex]?.id;
			
			if (insertBeforeId) {
				const targetIndex = newItems.findIndex(i => i.id === insertBeforeId);
				newItems.splice(targetIndex, 0, item);
			} else {
				// Find the last sibling in newItems and insert after it, or just push to end if no siblings
				const lastSibling = newSiblings[newSiblings.length - 1];
				if (lastSibling) {
					const targetIndex = newItems.findIndex(i => i.id === lastSibling.id);
					newItems.splice(targetIndex + 1, 0, item);
				} else {
					newItems.push(item);
				}
			}
			return newItems;
		});
	}, []);

	const duplicateItem = useCallback((id: string) => {
		setItems((prev) => {
			const item = prev.find((i) => i.id === id);
			if (!item) return prev;
			const newId = generateId();
			const newItem = { ...item, id: newId };
			const index = prev.findIndex((i) => i.id === id);
			const newItems = [...prev];
			newItems.splice(index + 1, 0, newItem);
			setSelectedId(newId);
			return newItems;
		});
	}, []);

	const value = useMemo(() => ({
		items,
		selectedId,
		viewMode,
		setViewMode,
		addItem,
		removeItem,
		selectItem,
		selectItemOnly,
		updateItemProps,
		moveItem,
		duplicateItem,
		showCode,
		setShowCode,
		selectedRecipientEmail,
		setSelectedRecipientEmail,
		editingMode,
		setEditingMode,
	}), [
		items, selectedId, viewMode, showCode, selectedRecipientEmail, editingMode,
		addItem, removeItem, selectItem, selectItemOnly, updateItemProps, moveItem, duplicateItem
	]);

	return (
		<BuilderContext.Provider value={value}>
			{children}
		</BuilderContext.Provider>
	);
}

export const useBuilder = () => {
	const context = useContext(BuilderContext);
	if (!context)
		throw new Error("useBuilder must be used within BuilderProvider");
	return context;
};
