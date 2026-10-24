import { createContext, type ReactNode, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";
import { defaultPropsForType } from "@/config/builder-defaults";
import { DEFAULT_EMAIL_SETTINGS, type EmailSettings, normalizeSettings } from "@/config/email-settings";
import { generateId } from "@/lib/builder-utils";
import { cloneSubtree } from "@/lib/library";
import type {
	BuilderContextType,
	BuilderItem,
	BuilderItemProps,
	ItemType,
} from "@/types/builder";

const BuilderContext = createContext<BuilderContextType | null>(null);

const STORAGE_KEY = "email-builder:items";
const SETTINGS_KEY = "email-builder:settings";
const HISTORY_LIMIT = 100;
const COALESCE_MS = 1000;

export function BuilderProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<BuilderItem[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"mobile" | "tablet" | "laptop">("laptop");
	const [settings, setSettings] = useState<EmailSettings>(DEFAULT_EMAIL_SETTINGS);
	const [previewDark, setPreviewDark] = useState(false);
	const [showCode, setShowCode] = useState(false);
	const [editingMode, setEditingMode] = useState<BuilderContextType['editingMode']>({ type: 'block' });
	const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });
	const [hydrated, setHydrated] = useState(false);

	const itemsRef = useRef<BuilderItem[]>([]);
	const pastRef = useRef<BuilderItem[][]>([]);
	const futureRef = useRef<BuilderItem[][]>([]);
	const lastCommitRef = useRef<{ key: string | null; time: number }>({ key: null, time: 0 });

	const syncHistoryState = useCallback(() => {
		setHistoryState({ canUndo: pastRef.current.length > 0, canRedo: futureRef.current.length > 0 });
	}, []);

	const applyItems = useCallback((next: BuilderItem[]) => {
		itemsRef.current = next;
		setItems(next);
		setSelectedId((prev) => (prev && !next.some((i) => i.id === prev) ? null : prev));
	}, []);

	/** Applies a change and records it in history. Changes sharing a `key` within a short window collapse into one undo step. */
	const commit = useCallback((fn: (prev: BuilderItem[]) => BuilderItem[], key?: string) => {
		const current = itemsRef.current;
		const next = fn(current);
		if (next === current) return;

		const now = Date.now();
		const last = lastCommitRef.current;
		const coalesce = key !== undefined && last.key === key && now - last.time < COALESCE_MS;
		if (!coalesce) {
			pastRef.current.push(current);
			if (pastRef.current.length > HISTORY_LIMIT) pastRef.current.shift();
		}
		lastCommitRef.current = { key: key ?? null, time: now };
		futureRef.current = [];
		applyItems(next);
		syncHistoryState();
	}, [applyItems, syncHistoryState]);

	const undo = useCallback(() => {
		const previous = pastRef.current.pop();
		if (!previous) return;
		futureRef.current.push(itemsRef.current);
		lastCommitRef.current = { key: null, time: 0 };
		applyItems(previous);
		syncHistoryState();
	}, [applyItems, syncHistoryState]);

	const redo = useCallback(() => {
		const next = futureRef.current.pop();
		if (!next) return;
		pastRef.current.push(itemsRef.current);
		lastCommitRef.current = { key: null, time: 0 };
		applyItems(next);
		syncHistoryState();
	}, [applyItems, syncHistoryState]);

	const updateSettings = useCallback((patch: Partial<EmailSettings>) => {
		setSettings((prev) => ({ ...prev, ...patch }));
	}, []);

	const replaceItems = useCallback((next: BuilderItem[], nextSettings?: EmailSettings) => {
		if (nextSettings) setSettings(nextSettings);
		commit(() => next);
		setSelectedId(null);
		setEditingMode({ type: 'block' });
	}, [commit]);

	// Restore the last session from localStorage (client only, so SSR markup stays stable).
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) applyItems(parsed);
			}
			const rawSettings = localStorage.getItem(SETTINGS_KEY);
			if (rawSettings) setSettings(normalizeSettings(JSON.parse(rawSettings)));
		} catch {
			// Ignore unreadable or blocked storage.
		}
		setHydrated(true);
	}, [applyItems]);

	// Autosave.
	useEffect(() => {
		if (!hydrated) return;
		const timer = setTimeout(() => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
				localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
			} catch {
				// Ignore quota or blocked storage errors.
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [items, settings, hydrated]);

	const addItem = useCallback((type: ItemType, extraProps?: Partial<BuilderItemProps>, parentId?: string, colIndex?: number, indexInCol?: number) => {
		const id = generateId();
		const newItem: BuilderItem = {
			id,
			type,
			parentId,
			colIndex,
			props: { ...defaultPropsForType(type), ...extraProps },
		};

		commit((prev) => {
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
	}, [commit]);

	const removeItem = useCallback((id: string) => {
		const getDescendants = (parentId: string, allItems: BuilderItem[]): string[] => {
			const children = allItems.filter(i => i.parentId === parentId);
			return [...children.map(c => c.id), ...children.flatMap(c => getDescendants(c.id, allItems))];
		};

		commit((prev) => {
			const toRemove = new Set([id, ...getDescendants(id, prev)]);
			return prev.filter(i => !toRemove.has(i.id));
		});

		setSelectedId((prev) => (prev === id ? null : prev));
	}, [commit]);

	const selectItem = useCallback((id: string | null) => {
		setSelectedId(id);
		setEditingMode({ type: 'block' });
	}, []);

	const selectItemOnly = useCallback((id: string | null) => {
		setSelectedId(id);
	}, []);

	const updateItemProps = useCallback((id: string, props: Partial<BuilderItemProps>) => {
		commit(
			(prev) => prev.map((i) => (i.id === id ? { ...i, props: { ...i.props, ...props } } : i)),
			`props:${id}`,
		);
	}, [commit]);

	const moveItem = useCallback((id: string, toParentId: string | undefined, toColIndex: number | undefined, toIndex: number) => {
		commit((prev) => {
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
		}, `move:${id}`);
	}, [commit]);

	const duplicateItem = useCallback((id: string) => {
		const source = itemsRef.current.find((i) => i.id === id);
		if (!source) return;

		// Clone the block together with everything nested inside it.
		const idMap = new Map<string, string>([[id, generateId()]]);
		const subtree: BuilderItem[] = [];
		const collect = (parentId: string) => {
			for (const child of itemsRef.current.filter((i) => i.parentId === parentId)) {
				idMap.set(child.id, generateId());
				subtree.push(child);
				collect(child.id);
			}
		};
		collect(id);

		const clones = [source, ...subtree].map((i) => ({
			...i,
			id: idMap.get(i.id) as string,
			parentId: i.id === id ? i.parentId : idMap.get(i.parentId as string),
			props: { ...i.props },
		}));

		commit((prev) => {
			const index = prev.findIndex((i) => i.id === id);
			const next = [...prev];
			next.splice(index + 1, 0, ...clones);
			return next;
		});
		setSelectedId(idMap.get(id) as string);
	}, [commit]);

	const selectedIdRef = useRef<string | null>(null);
	selectedIdRef.current = selectedId;

	// Keyboard shortcuts. Text fields keep their native behaviour (including their own undo).
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName))) return;
			if (document.querySelector('[role="dialog"]')) return;

			const mod = e.metaKey || e.ctrlKey;
			const key = e.key.toLowerCase();
			const id = selectedIdRef.current;

			if (mod && !e.altKey) {
				if (key === "z") {
					e.preventDefault();
					e.shiftKey ? redo() : undo();
				} else if (key === "y") {
					e.preventDefault();
					redo();
				} else if (key === "d" && id) {
					e.preventDefault();
					duplicateItem(id);
				}
				return;
			}

			if (!id || e.altKey || e.shiftKey) return;
			if (key === "delete" || key === "backspace") {
				e.preventDefault();
				removeItem(id);
			} else if (key === "arrowup" || key === "arrowdown") {
				const current = itemsRef.current.find((i) => i.id === id);
				if (!current) return;
				const siblings = itemsRef.current.filter((i) => i.parentId === current.parentId && i.colIndex === current.colIndex);
				const index = siblings.findIndex((i) => i.id === id);
				const target = key === "arrowup" ? index - 1 : index + 1;
				if (target < 0 || target >= siblings.length) return;
				e.preventDefault();
				moveItem(id, current.parentId, current.colIndex, target);
			} else if (key === "escape") {
				setSelectedId(null);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [undo, redo, removeItem, duplicateItem, moveItem]);

	/** Appends a saved block (with its nested items) to the end of the email. */
	const insertItems = useCallback((subtree: BuilderItem[]) => {
		const clones = cloneSubtree(subtree, generateId);
		if (clones.length === 0) return;
		commit((prev) => [...prev, ...clones]);
		setSelectedId(clones[0].id);
	}, [commit]);

	const value = useMemo(() => ({
		items,
		selectedId,
		viewMode,
		setViewMode,
		settings,
		updateSettings,
		previewDark,
		setPreviewDark,
		undo,
		redo,
		canUndo: historyState.canUndo,
		canRedo: historyState.canRedo,
		replaceItems,
		insertItems,
		addItem,
		removeItem,
		selectItem,
		selectItemOnly,
		updateItemProps,
		moveItem,
		duplicateItem,
		showCode,
		setShowCode,
		editingMode,
		setEditingMode,
	}), [
		items, selectedId, viewMode, settings, updateSettings, previewDark, historyState, showCode, editingMode,
		undo, redo, replaceItems, insertItems, addItem, removeItem, selectItem, selectItemOnly, updateItemProps, moveItem, duplicateItem
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
