import type { BuilderItemProps } from "@/types/builder";

export interface PaddingSides {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

type PaddingProps = Pick<BuilderItemProps, "paddingX" | "paddingY" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft">;

/**
 * Resolves a block's padding. A per-side value wins, then the vertical/horizontal value, then the fallback.
 * With `inheritX: false` the horizontal sides ignore `paddingX` (used where `paddingX` means something else, like a button's own padding).
 */
export function resolvePadding(p: Partial<PaddingProps>, fallback: { y: number; x: number }, { inheritX = true } = {}): PaddingSides {
	const y = p.paddingY ?? fallback.y;
	const x = inheritX ? (p.paddingX ?? fallback.x) : fallback.x;
	return {
		top: p.paddingTop ?? y,
		right: p.paddingRight ?? x,
		bottom: p.paddingBottom ?? y,
		left: p.paddingLeft ?? x,
	};
}

export const paddingCss = (p: Partial<PaddingProps>, fallback: { y: number; x: number }, options?: { inheritX?: boolean }) => {
	const { top, right, bottom, left } = resolvePadding(p, fallback, options);
	return `${top}px ${right}px ${bottom}px ${left}px`;
};
