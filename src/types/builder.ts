import type { ReactNode } from "react";
import type { EmailSettings } from "@/config/email-settings";
export type ItemType =
	| "Heading"
	| "Text"
	| "Link"
	| "ButtonFull"
	| "ButtonSplit"
	| "ButtonAppStore"
	| "Img"
	| "Hr"
	| "Divider"
	| "ListFeatures"
	| "LayoutTwoCol"
	| "LayoutHalf"
	| "LayoutThird"
	| "HeaderCentered"
	| "HeaderSplit"
	| "FooterCentered"
	| "FooterSplit"
	| "Avatar"
	| "AvatarGroup"
	| "FeedbackSurvey"
	| "FeedbackSimple"
	| "FeedbackReviews"
	| "CodeInline"
	| "Container"
	| "Banner"
	| "LayoutSection"
	| "Variable"
	| "HeaderSocial";
export type AlignType = "left" | "center" | "right";
export type FontWeightType = "normal" | "bold";
export interface ListItem {
	number: number;
	title: string;
	description: string;
	imageUrl?: string;
}
export interface NavLink {
	text: string;
	href: string;
}
export interface SocialLink {
	alt: string;
	imageUrl: string;
	href?: string;
}
export interface BuilderItemProps {
	text: string;
	fontSize: number;
	fontWeight: FontWeightType;
	color: string;
	bgColor: string;
	align: AlignType;
	href: string;
	href2: string;
	linkText: string;
	title: string;
	emoji: string;
	borderRadius: number;
	paddingX: number;
	paddingY: number;
	/** Per-side overrides. When unset, paddingY / paddingX apply. */
	/** Grid layouts: collapse columns into rows on narrow screens (default true). */
	stackOnMobile?: boolean;
	/** Grid layouts: space between columns in px. */
	columnGap?: number;
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	imageUrl?: string;
	imageAlt?: string;
	imageWidth?: number;
	maxWidth?: number;
	titleFontSize?: number;
	addressFontSize?: number;
	contactFontSize?: number;
	descriptionFontSize?: number;
	titleColor?: string;
	descriptionColor?: string;
	textColor?: string;
	taglineColor?: string;
	addressColor?: string;
	contactColor?: string;
	bgColor2?: string;
	color2?: string;
	listItems?: ListItem[];
	navLinks?: NavLink[];
	socialLinks?: SocialLink[];
	snippetBgColor?: string;
	snippetColor?: string;
	linkColor?: string;
	isVariable?: boolean;
	thickness?: number;
	width?: number;
	avatarSize?: number;
	avatarShape?: 'circle' | 'square';
	nameFontSize?: number;
}
export interface BuilderItem {
	id: string;
	type: ItemType;
	props: BuilderItemProps;
	parentId?: string;
	colIndex?: number;
}
export type ViewMode = "mobile" | "tablet" | "laptop";
export interface BuilderContextType {
	items: BuilderItem[];
	selectedId: string | null;
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	settings: EmailSettings;
	updateSettings: (patch: Partial<EmailSettings>) => void;
	previewDark: boolean;
	setPreviewDark: (dark: boolean) => void;
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	insertItems: (subtree: BuilderItem[]) => void;
	replaceItems: (items: BuilderItem[], settings?: EmailSettings) => void;
	addItem: (type: ItemType, extraProps?: Partial<BuilderItemProps>, parentId?: string, colIndex?: number, indexInCol?: number) => string;
	removeItem: (id: string) => void;
	selectItem: (id: string | null) => void;
	selectItemOnly: (id: string | null) => void;
	updateItemProps: (id: string, props: Partial<BuilderItemProps>) => void;
	moveItem: (id: string, toParentId: string | undefined, toColIndex: number | undefined, toIndex: number) => void;
	duplicateItem: (id: string) => void;
	showCode: boolean;
	setShowCode: (show: boolean) => void;
	editingMode: { type: 'block' } | { type: 'inline-snippet', snippet: string } | { type: 'inline-link', link: string };
	setEditingMode: (mode: { type: 'block' } | { type: 'inline-snippet', snippet: string } | { type: 'inline-link', link: string }) => void;
}
export interface TemplateConfig {
	type: ItemType;
	label: string;
	description: string;
	icon: ReactNode;
	preview: ReactNode;
	variant?: string;
	category?: string;
	defaultProps?: Partial<BuilderItemProps>;
}
