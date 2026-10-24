import { defaultPropsForType } from "@/config/builder-defaults";
import { generateId } from "@/lib/builder-utils";
import type { BuilderItem, BuilderItemProps, ItemType } from "@/types/builder";

interface NodeSpec {
	type: ItemType;
	props?: Partial<BuilderItemProps>;
	/** Children keyed by column index, for layout blocks. */
	columns?: NodeSpec[][];
}

export interface StarterTemplate {
	id: string;
	name: string;
	description: string;
	nodes: NodeSpec[];
}

const IMG = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop";

export const STARTER_TEMPLATES: StarterTemplate[] = [
	{
		id: "welcome",
		name: "Welcome",
		description: "Greet new signups with one clear next step.",
		nodes: [
			{ type: "HeaderCentered", props: { paddingY: 32, navLinks: [] } },
			{ type: "Heading", props: { text: "Welcome aboard, {{name}}!", paddingY: 16 } },
			{ type: "Text", props: { text: "We're thrilled to have you. Your account is ready, and getting started takes less than two minutes.", align: "center" } },
			{ type: "Img", props: { imageUrl: IMG, imageAlt: "Welcome illustration", borderRadius: 12 } },
			{ type: "ButtonFull", props: { text: "Open your dashboard", align: "center" } },
			{ type: "Divider" },
			{ type: "Text", props: { text: "Need a hand? Just reply to this email and we'll help.", align: "center", fontSize: 13, color: "#6b7280" } },
			{ type: "FooterCentered" },
		],
	},
	{
		id: "newsletter",
		name: "Newsletter",
		description: "Headline story with two highlights below.",
		nodes: [
			{ type: "HeaderCentered", props: { paddingY: 32 } },
			{ type: "Heading", props: { text: "This month at Acme", paddingY: 16 } },
			{ type: "Text", props: { text: "Hi {{name}}, here's what shipped, what we learned, and what's coming next.", align: "center" } },
			{ type: "Img", props: { imageUrl: IMG, imageAlt: "Featured story" } },
			{
				type: "LayoutHalf",
				columns: [
					[
						{ type: "Heading", props: { text: "New editor", fontSize: 18, align: "left", paddingY: 8 } },
						{ type: "Text", props: { text: "Build layouts faster with drag-and-drop blocks.", fontSize: 14 } },
					],
					[
						{ type: "Heading", props: { text: "Team sharing", fontSize: 18, align: "left", paddingY: 8 } },
						{ type: "Text", props: { text: "Invite teammates and review changes together.", fontSize: 14 } },
					],
				],
			},
			{ type: "ButtonFull", props: { text: "Read the full update", align: "center" } },
			{ type: "FooterSplit" },
		],
	},
	{
		id: "receipt",
		name: "Receipt",
		description: "Order confirmation with a summary table.",
		nodes: [
			{ type: "Heading", props: { text: "Thanks for your order, {{name}}", paddingY: 24 } },
			{ type: "Text", props: { text: "Your payment was received. A copy of your receipt is below.", align: "center" } },
			{ type: "Divider" },
			{
				type: "LayoutHalf",
				columns: [
					[{ type: "Text", props: { text: "Order number", color: "#6b7280", fontSize: 13, paddingY: 4 } }, { type: "Text", props: { text: "Date", color: "#6b7280", fontSize: 13, paddingY: 4 } }, { type: "Text", props: { text: "Payment method", color: "#6b7280", fontSize: 13, paddingY: 4 } }],
					[{ type: "Text", props: { text: "#10234", fontSize: 13, paddingY: 4, align: "right" } }, { type: "Text", props: { text: "Oct 24, 2026", fontSize: 13, paddingY: 4, align: "right" } }, { type: "Text", props: { text: "Visa ending 4242", fontSize: 13, paddingY: 4, align: "right" } }],
				],
			},
			{ type: "Divider" },
			{
				type: "LayoutHalf",
				columns: [
					[{ type: "Text", props: { text: "Total", fontWeight: "bold", paddingY: 4 } }],
					[{ type: "Text", props: { text: "$49.00", fontWeight: "bold", paddingY: 4, align: "right" } }],
				],
			},
			{ type: "ButtonFull", props: { text: "View order", align: "center" } },
			{ type: "FooterCentered" },
		],
	},
	{
		id: "password-reset",
		name: "Password reset",
		description: "Short transactional email with one button.",
		nodes: [
			{ type: "Heading", props: { text: "Reset your password", paddingY: 32 } },
			{ type: "Text", props: { text: "Hi {{name}}, we received a request to reset your password. Click the button below to choose a new one. The link expires in 60 minutes.", align: "center" } },
			{ type: "ButtonFull", props: { text: "Reset password", align: "center" } },
			{ type: "Text", props: { text: "If you didn't request this, you can safely ignore this email.", align: "center", fontSize: 13, color: "#6b7280" } },
			{ type: "FooterCentered" },
		],
	},
];

/** Builds fresh items (new ids, defaults applied) from a template spec. */
export function instantiateTemplate(template: StarterTemplate): BuilderItem[] {
	const out: BuilderItem[] = [];
	const walk = (nodes: NodeSpec[], parentId?: string, colIndex?: number) => {
		for (const node of nodes) {
			const id = generateId();
			out.push({ id, type: node.type, parentId, colIndex, props: { ...defaultPropsForType(node.type), ...node.props } });
			node.columns?.forEach((col, i) => walk(col, id, i));
		}
	};
	walk(template.nodes);
	return out;
}
