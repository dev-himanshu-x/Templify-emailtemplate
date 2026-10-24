import { Columns } from "lucide-react";
import { DEFAULT_COLUMN_GAP } from "@/components/blocks/layout-renderer";
import type { BuilderItem } from "@/types/builder";
import { ColorInput, SettingField, SettingGroup, SettingRange } from "./shared/SettingComponents";

interface LayoutSettingsProps {
	selectedItem: BuilderItem;
	updateProp: (key: string, value: any) => void;
}

export function LayoutSettings({ selectedItem, updateProp }: LayoutSettingsProps) {
	const { props: p, type } = selectedItem;
	const isGrid = type === "LayoutHalf" || type === "LayoutTwoCol" || type === "LayoutThird";
	const stack = p.stackOnMobile !== false;

	return (
		<SettingGroup title="Layout" icon={<Columns size={12} className="text-emerald-500" />}>
			<p className="text-[10px] text-gray-400 italic leading-relaxed px-1">Drop components into the columns to fill this layout.</p>
			{isGrid && (
				<>
					<SettingField label="On phones">
						<label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer px-1">
							<input type="checkbox" checked={stack} onChange={(e) => updateProp("stackOnMobile", e.target.checked)} className="accent-blue-600" />
							Stack columns on top of each other
						</label>
					</SettingField>
					<SettingRange label="Column gap" value={p.columnGap ?? DEFAULT_COLUMN_GAP} min={0} max={64} onChange={(v) => updateProp("columnGap", Number.isNaN(v) ? 0 : v)} />
				</>
			)}
			<SettingField label="Background">
				<ColorInput value={p.bgColor} onChange={(v) => updateProp("bgColor", v)} onClear={() => updateProp("bgColor", "transparent")} />
			</SettingField>
		</SettingGroup>
	);
}
