import React from "react";

import type { BuilderItem } from "@/types/builder";
import { renderContent } from "./content-renderer";
import { renderButton } from "./button-renderer";
import { renderList } from "./list-renderer";
import { renderHeaderFooter } from "./header-footer-renderer";
import { renderFeedback } from "./feedback-renderer";
import { renderLayoutBlock } from "./layout-renderer";

export function renderBlock(
	item: BuilderItem, 
	renderSlot?: (colIndex: number) => React.ReactElement | React.ReactNode,
	onInlineClick?: (type: 'inline-link' | 'inline-snippet', value: string) => void,
	recipientName?: string
): React.ReactElement | null {
	const type = item.type;

	if (type === 'Heading' || type === 'Text' || type === 'Link' || type === 'Img' || type === 'Avatar' || type === 'CodeInline' || type === 'Hr' || type === 'Divider' || type === 'Banner') {
		return renderContent(item, onInlineClick, recipientName);
	}

	if (type.startsWith('Button')) {
		return renderButton(item);
	}

	if (type.startsWith('List')) {
		return renderList(item);
	}

	if (type.startsWith('Feedback')) {
		return renderFeedback(item);
	}

	if (type.startsWith('Header') || type.startsWith('Footer')) {
		return renderHeaderFooter(item);
	}

	return renderLayoutBlock({ type, renderSlot });
}
