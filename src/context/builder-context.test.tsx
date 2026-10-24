// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { collectSubtree } from "@/lib/library";
import { BuilderProvider, useBuilder } from "./builder-context";

const wrapper = ({ children }: { children: ReactNode }) => <BuilderProvider>{children}</BuilderProvider>;
const setup = () => renderHook(() => useBuilder(), { wrapper });
const press = (key: string, init: KeyboardEventInit = {}) => act(() => void window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...init })));

// Node's experimental localStorage shadows jsdom's and is unusable without a backing file, so use a plain in-memory stand-in.
beforeEach(() => {
	const store = new Map<string, string>();
	vi.stubGlobal("localStorage", {
		getItem: (k: string) => store.get(k) ?? null,
		setItem: (k: string, v: string) => void store.set(k, String(v)),
		removeItem: (k: string) => void store.delete(k),
		clear: () => store.clear(),
	});
});

describe("history", () => {
	it("undoes and redoes adding a block", () => {
		const { result } = setup();
		act(() => void result.current.addItem("Text"));
		expect(result.current.items).toHaveLength(1);
		expect(result.current.canUndo).toBe(true);

		act(() => result.current.undo());
		expect(result.current.items).toHaveLength(0);
		expect(result.current.canRedo).toBe(true);

		act(() => result.current.redo());
		expect(result.current.items).toHaveLength(1);
	});

	it("collapses rapid edits to one block into a single undo step", () => {
		const { result } = setup();
		let id = "";
		act(() => {
			id = result.current.addItem("Text");
		});
		act(() => result.current.updateItemProps(id, { text: "a" }));
		act(() => result.current.updateItemProps(id, { text: "ab" }));
		act(() => result.current.updateItemProps(id, { text: "abc" }));
		act(() => result.current.undo());
		expect(result.current.items[0].props.text).not.toBe("ab");
		expect(result.current.items).toHaveLength(1);
	});
});

describe("blocks", () => {
	it("duplicates a layout together with its nested blocks", () => {
		const { result } = setup();
		let layout = "";
		act(() => {
			layout = result.current.addItem("LayoutHalf");
		});
		act(() => void result.current.addItem("Text", { text: "child" }, layout, 0));
		act(() => result.current.duplicateItem(layout));

		const layouts = result.current.items.filter((i) => i.type === "LayoutHalf");
		const texts = result.current.items.filter((i) => i.type === "Text");
		expect(layouts).toHaveLength(2);
		expect(texts).toHaveLength(2);
		expect(new Set(texts.map((t) => t.parentId))).toEqual(new Set(layouts.map((l) => l.id)));
	});

	it("inserts a saved block with fresh ids", () => {
		const { result } = setup();
		let layout = "";
		act(() => {
			layout = result.current.addItem("LayoutHalf");
		});
		act(() => void result.current.addItem("Text", {}, layout, 1));
		const saved = collectSubtree(result.current.items, layout);

		act(() => result.current.insertItems(saved));
		expect(result.current.items).toHaveLength(4);
		expect(new Set(result.current.items.map((i) => i.id)).size).toBe(4);
		expect(result.current.items.filter((i) => i.parentId === undefined)).toHaveLength(2);
	});
});

describe("shortcuts", () => {
	it("deletes the selected block and moves it with the arrow keys", () => {
		const { result } = setup();
		let a = "";
		act(() => {
			a = result.current.addItem("Text", { text: "A" });
			result.current.addItem("Text", { text: "B" });
		});
		act(() => result.current.selectItem(a));

		press("ArrowDown");
		expect(result.current.items.map((i) => i.props.text)).toEqual(["B", "A"]);

		press("Delete");
		expect(result.current.items.map((i) => i.props.text)).toEqual(["B"]);

		press("z", { metaKey: true });
		expect(result.current.items).toHaveLength(2);
	});

	it("duplicates with Cmd+D", () => {
		const { result } = setup();
		act(() => void result.current.addItem("Heading"));
		press("d", { metaKey: true });
		expect(result.current.items).toHaveLength(2);
	});
});
