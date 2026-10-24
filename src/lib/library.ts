import { useSyncExternalStore } from "react";
import type { EmailSettings } from "@/config/email-settings";
import type { BuilderItem } from "@/types/builder";

export interface SavedTemplate {
	id: string;
	name: string;
	updatedAt: number;
	items: BuilderItem[];
	settings: EmailSettings;
}

export interface SavedBlock {
	id: string;
	name: string;
	updatedAt: number;
	/** The block and everything nested inside it. The first entry is the block itself. */
	items: BuilderItem[];
}

const EMPTY: never[] = [];

/** A small localStorage-backed list that React components can subscribe to. */
export function createLibrary<T extends { id: string }>(storageKey: string) {
	let cache: { raw: string | null; value: T[] } | null = null;
	const listeners = new Set<() => void>();

	const read = (): T[] => {
		try {
			const raw = localStorage.getItem(storageKey);
			if (cache && cache.raw === raw) return cache.value;
			const parsed = raw ? JSON.parse(raw) : [];
			cache = { raw, value: Array.isArray(parsed) ? parsed : [] };
		} catch {
			cache = { raw: null, value: [] };
		}
		return cache.value;
	};

	/** Returns false when the browser refused the write (for example, storage is full or blocked). */
	const write = (value: T[]): boolean => {
		try {
			localStorage.setItem(storageKey, JSON.stringify(value));
		} catch {
			return false;
		}
		listeners.forEach((l) => l());
		return true;
	};

	const subscribe = (listener: () => void) => {
		listeners.add(listener);
		const onStorage = (e: StorageEvent) => e.key === storageKey && listener();
		window.addEventListener("storage", onStorage);
		return () => {
			listeners.delete(listener);
			window.removeEventListener("storage", onStorage);
		};
	};

	return {
		list: read,
		add: (entry: T) => write([entry, ...read()]),
		update: (id: string, patch: Partial<T>) => write(read().map((e) => (e.id === id ? { ...e, ...patch } : e))),
		remove: (id: string) => write(read().filter((e) => e.id !== id)),
		/** React hook returning the current entries and re-rendering on change. */
		useEntries: (): T[] => useSyncExternalStore(subscribe, read, () => EMPTY as T[]),
	};
}

export const templateLibrary = createLibrary<SavedTemplate>("email-builder:library");
export const blockLibrary = createLibrary<SavedBlock>("email-builder:blocks");

/** Returns the block with the given id plus all of its descendants, parents before children. */
export function collectSubtree(items: BuilderItem[], rootId: string): BuilderItem[] {
	const root = items.find((i) => i.id === rootId);
	if (!root) return [];
	const out: BuilderItem[] = [root];
	const walk = (parentId: string) => {
		for (const child of items.filter((i) => i.parentId === parentId)) {
			out.push(child);
			walk(child.id);
		}
	};
	walk(rootId);
	return out;
}

/** Copies items with fresh ids. The first item becomes a root block, the rest keep their nesting. */
export function cloneSubtree(subtree: BuilderItem[], newId: () => string): BuilderItem[] {
	const idMap = new Map(subtree.map((i) => [i.id, newId()]));
	return subtree.map((i, index) => ({
		...i,
		id: idMap.get(i.id) as string,
		parentId: index === 0 ? undefined : i.parentId ? idMap.get(i.parentId) : undefined,
		colIndex: index === 0 ? undefined : i.colIndex,
		props: { ...i.props },
	}));
}
