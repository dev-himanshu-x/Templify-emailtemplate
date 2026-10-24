// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { instantiateTemplate, STARTER_TEMPLATES } from "@/config/starter-templates";
import { DEFAULT_EMAIL_SETTINGS } from "@/config/email-settings";
import { lintTemplate, parseTemplateJson, renderEmailHtml, renderEmailText } from "./export";

describe("starter templates", () => {
	for (const template of STARTER_TEMPLATES) {
		it(`${template.name} renders to HTML and plain text`, async () => {
			const items = instantiateTemplate(template);
			const html = await renderEmailHtml(items);
			expect(html).toContain("<html");
			expect((await renderEmailText(items)).length).toBeGreaterThan(10);
			expect(parseTemplateJson(JSON.stringify({ items }))?.items).toHaveLength(items.length);
		});
	}
});

describe("email settings", () => {
	const items = instantiateTemplate(STARTER_TEMPLATES[0]);
	const settings = { ...DEFAULT_EMAIL_SETTINGS, subject: "Hello there", preheader: "Quick peek", pageBgColor: "#123456", maxWidth: 520 };

	it("applies subject, preheader and styles to the HTML", async () => {
		const html = await renderEmailHtml(items, settings);
		expect(html).toContain("<title>Hello there</title>");
		expect(html).toContain("Quick peek");
		expect(html).toContain("#123456");
		expect(html).toContain("520px");
	});
	it("lints subject and preheader", () => {
		expect(lintTemplate(items, DEFAULT_EMAIL_SETTINGS).map((i) => i.id)).toEqual(expect.arrayContaining(["subject", "preheader"]));
		expect(lintTemplate(items, settings).map((i) => i.id)).not.toContain("subject");
	});
});

describe("lintTemplate", () => {
	it("flags an empty template", () => {
		expect(lintTemplate([])).toHaveLength(1);
	});
	it("flags missing alt text and placeholder links", () => {
		const items = instantiateTemplate({ id: "t", name: "t", description: "", nodes: [{ type: "Img" }, { type: "ButtonFull" }] });
		const messages = lintTemplate(items).map((i) => i.message).join("\n");
		expect(messages).toMatch(/alt text/);
		expect(messages).toMatch(/placeholder link/);
		expect(messages).toMatch(/No footer/);
	});
});

describe("padding", () => {
	it("applies per-side padding to the exported HTML", async () => {
		const items = instantiateTemplate({ id: "p", name: "p", description: "", nodes: [{ type: "Text", props: { text: "Hello", paddingY: 10, paddingX: 20, paddingTop: 33, paddingLeft: 7 } }] });
		const html = await renderEmailHtml(items);
		expect(html).toContain("padding:33px 20px 10px 7px");
	});
	it("honours zero padding instead of falling back to a default", async () => {
		const items = instantiateTemplate({ id: "p", name: "p", description: "", nodes: [{ type: "HeaderCentered", props: { paddingY: 0, paddingX: 0 } }] });
		expect(await renderEmailHtml(items)).toContain("padding:0px 0px 0px 0px");
	});
});

describe("padding placement", () => {
	it("puts padding on an inner cell and not on the outer table", async () => {
		const items = instantiateTemplate({ id: "p", name: "p", description: "", nodes: [{ type: "Text", props: { text: "Hello", paddingY: 10, paddingX: 20 } }] });
		const html = await renderEmailHtml(items);
		expect(html).toMatch(/<td[^>]*style="[^"]*padding:10px 20px 10px 20px/);
		expect(html).not.toMatch(/<table[^>]*style="[^"]*padding:10px/);
	});
	it("renders the image alt text", async () => {
		const items = instantiateTemplate({ id: "p", name: "p", description: "", nodes: [{ type: "Img", props: { imageAlt: "A sunset" } }] });
		expect(await renderEmailHtml(items)).toContain('alt="A sunset"');
	});
});

describe("columns", () => {
	it("stacks several blocks inside one column vertically", async () => {
		const items = instantiateTemplate({
			id: "c", name: "c", description: "",
			nodes: [{ type: "LayoutHalf", columns: [[{ type: "Text", props: { text: "AAA" } }, { type: "Text", props: { text: "BBB" } }], []] }],
		});
		const html = await renderEmailHtml(items);
		const doc = new DOMParser().parseFromString(html, "text/html");
		const find = (text: string) => [...doc.querySelectorAll("p")].find((el) => el.textContent === text) as Element;
		let common: Element | null = find("AAA");
		while (common && !common.contains(find("BBB"))) common = common.parentElement;
		// Stacked blocks share a single cell. Side by side, they would share a table row (<tr>).
		expect(common?.tagName).toBe("TD");
	});
});

describe("dark mode", () => {
	const items = instantiateTemplate(STARTER_TEMPLATES[3]);
	it("pins light mode by default", async () => {
		const html = await renderEmailHtml(items);
		expect(html).toContain('content="light"');
		expect(html).toContain("light only");
	});
	it("ships dark colours when enabled", async () => {
		const html = await renderEmailHtml(items, { ...DEFAULT_EMAIL_SETTINGS, darkMode: true, darkTextColor: "#abcdef", darkPageBgColor: "#010203" });
		expect(html).toContain('content="light dark"');
		expect(html).toContain("prefers-color-scheme: dark");
		expect(html).toContain("#abcdef");
		expect(html).toContain("#010203");
		expect(html).not.toContain("light only");
	});
});
