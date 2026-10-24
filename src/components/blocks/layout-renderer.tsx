import React from "react";
import { Row, Column } from "@react-email/components";
import { PaddedSection as Section } from "./padded-section";
import { paddingCss } from "@/lib/padding";
import type { BuilderItem } from "@/types/builder";

interface LayoutRendererProps {
	item: BuilderItem;
	renderSlot?: (colIndex: number) => React.ReactElement | React.ReactNode;
}

/** Column widths (in %) for each grid layout. */
const COLUMN_WIDTHS: Record<string, number[]> = {
	LayoutHalf: [50, 50],
	LayoutTwoCol: [33.33, 66.67],
	LayoutThird: [33.33, 33.33, 33.34],
};

export const DEFAULT_COLUMN_GAP = 24;

export function renderLayoutBlock({ item, renderSlot }: LayoutRendererProps) {
	const { type, props: p } = item;
	const background = p.bgColor && p.bgColor !== "transparent" ? p.bgColor : undefined;
	const widths = COLUMN_WIDTHS[type];

	if (widths) {
		const gap = p.columnGap ?? DEFAULT_COLUMN_GAP;
		// `stack-col` is collapsed to full-width rows by a media query in EmailTemplate.
		const stackClass = p.stackOnMobile === false ? undefined : "stack-col";
		return (
			<Section style={{ padding: paddingCss(p, { y: 12, x: 0 }), backgroundColor: background }}>
				<Row>
					{widths.map((width, i) => (
						<Column
							key={i}
							className={stackClass}
							style={{
								width: `${width}%`,
								verticalAlign: "top",
								paddingLeft: i === 0 ? 0 : gap / 2,
								paddingRight: i === widths.length - 1 ? 0 : gap / 2,
							}}
						>
							{renderSlot?.(i)}
						</Column>
					))}
				</Row>
			</Section>
		);
	}

	if (type === "Container" || type === "LayoutSection") {
		return <Section style={{ padding: paddingCss(p, { y: 16, x: 16 }), backgroundColor: background }}>{renderSlot?.(0)}</Section>;
	}

	return null;
}
