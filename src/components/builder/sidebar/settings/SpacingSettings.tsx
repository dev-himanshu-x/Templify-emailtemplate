import { Maximize2 } from "lucide-react";
import type { BuilderItem } from "@/types/builder";
import { resolvePadding } from "@/lib/padding";
import { SettingField, SettingGroup, SettingRange, ToggleGroup } from "./shared/SettingComponents";

interface SpacingSettingsProps {
	selectedItem: BuilderItem;
	updateProp: (key: string, value: any) => void;
}

type Mode = "Simple" | "Per side";

const SIDE_KEYS = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] as const;
const MAX_PADDING = 200;

const clamp = (value: number) => (Number.isNaN(value) ? 0 : Math.min(MAX_PADDING, Math.max(0, Math.round(value))));

export function SpacingSettings({ selectedItem, updateProp }: SpacingSettingsProps) {
	const { props: p, type } = selectedItem;
	// A button's paddingX / paddingY size the button itself (see Button settings), so spacing around it is always per side.
	const isButton = type.startsWith("Button");
	const hasOverrides = SIDE_KEYS.some((k) => p[k] !== undefined);
	const mode: Mode = isButton || hasOverrides ? "Per side" : "Simple";
	const sides = resolvePadding(p, { y: 0, x: 0 }, { inheritX: !isButton });

	const setMode = (next: Mode) => {
		if (next === "Per side") {
			// Pin the current values so switching modes doesn't change how the block looks.
			updateProp("paddingTop", sides.top);
			updateProp("paddingRight", sides.right);
			updateProp("paddingBottom", sides.bottom);
			updateProp("paddingLeft", sides.left);
		} else {
			for (const key of SIDE_KEYS) updateProp(key, undefined);
		}
	};

	const sideInputs: { key: (typeof SIDE_KEYS)[number]; label: string; value: number }[] = [
		{ key: "paddingTop", label: "Top", value: sides.top },
		{ key: "paddingRight", label: "Right", value: sides.right },
		{ key: "paddingBottom", label: "Bottom", value: sides.bottom },
		{ key: "paddingLeft", label: "Left", value: sides.left },
	];

	return (
		<SettingGroup title={isButton ? "Spacing around button" : "Padding"} icon={<Maximize2 size={12} className="text-orange-500" />}>
			{!isButton && <ToggleGroup options={["Simple", "Per side"] as Mode[]} value={mode} onChange={setMode} />}

			{mode === "Simple" ? (
				<>
					<SettingRange label="Vertical" value={p.paddingY ?? 0} min={0} max={120} onChange={(v) => updateProp("paddingY", clamp(v))} />
					<SettingRange label="Horizontal" value={p.paddingX ?? 0} min={0} max={80} onChange={(v) => updateProp("paddingX", clamp(v))} />
				</>
			) : (
				<div className="space-y-3">
					<div className="grid grid-cols-2 gap-3">
						{sideInputs.map(({ key, label, value }) => (
							<SettingField key={key} label={label} valueDisplay="px">
								<input
									type="number"
									min={0}
									max={MAX_PADDING}
									value={value}
									onChange={(e) => updateProp(key, clamp(parseInt(e.target.value, 10)))}
									className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
								/>
							</SettingField>
						))}
					</div>
					<button
						type="button"
						onClick={() => SIDE_KEYS.forEach((k) => updateProp(k, undefined))}
						className="text-[10px] font-medium text-gray-400 hover:text-blue-600 transition-colors"
					>
						Reset to default spacing
					</button>
				</div>
			)}
		</SettingGroup>
	);
}
