import type { ComponentProps } from "react";
import { Column, Row, Section } from "@react-email/components";

/**
 * Drop-in replacement for react-email's Section that actually applies `style.padding`.
 * Padding on the outer <table> is ignored under `border-collapse: collapse` (and by Outlook),
 * so it is moved onto an inner <td>, which every client honours.
 */
export function PaddedSection({ style, children, ...rest }: ComponentProps<typeof Section>) {
	const { padding, ...tableStyle } = style ?? {};
	if (padding === undefined) {
		return (
			<Section {...rest} style={tableStyle}>
				{children}
			</Section>
		);
	}
	return (
		<Section {...rest} style={tableStyle}>
			<Row>
				<Column style={{ padding }}>{children}</Column>
			</Row>
		</Section>
	);
}
