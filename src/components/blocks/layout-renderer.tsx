import React from "react";
import { Section, Row, Column, Tailwind } from "@react-email/components";
import type { ItemType } from "@/types/builder";

interface LayoutRendererProps {
	type: ItemType;
	renderSlot?: (colIndex: number) => React.ReactElement | React.ReactNode;
}

export function renderLayoutBlock({ type, renderSlot }: LayoutRendererProps) {
	if (type === 'LayoutHalf') {
		return (
			<Tailwind>
				<Section className="py-3 px-0">
					<Row>
						<Column className="w-1/2 pr-3">{renderSlot?.(0)}</Column>
						<Column className="w-1/2 pl-3">{renderSlot?.(1)}</Column>
					</Row>
				</Section>
			</Tailwind>
		);
	}

	if (type === 'LayoutTwoCol') {
		return (
			<Tailwind>
				<Section className="py-3 px-0">
					<Row>
						<Column className="w-[33.33%] pr-3">{renderSlot?.(0)}</Column>
						<Column className="w-[66.66%] pl-3">{renderSlot?.(1)}</Column>
					</Row>
				</Section>
			</Tailwind>
		);
	}

	if (type === 'LayoutThird') {
		return (
			<Tailwind>
				<Section className="py-3 px-0">
					<Row>
						<Column className="w-[33.33%] pr-2">{renderSlot?.(0)}</Column>
						<Column className="w-[33.33%] px-2">{renderSlot?.(1)}</Column>
						<Column className="w-[33.33%] pl-2">{renderSlot?.(2)}</Column>
					</Row>
				</Section>
			</Tailwind>
		);
	}

	if (type === 'Container' || type === 'LayoutSection') {
		return (
			<Tailwind>
				<Section className="p-4">
					{renderSlot?.(0)}
				</Section>
			</Tailwind>
		);
	}

	return null;
}
