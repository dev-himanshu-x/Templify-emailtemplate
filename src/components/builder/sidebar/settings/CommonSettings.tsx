import { Move, Palette } from "lucide-react";
import type { BuilderItem } from "@/types/builder";
import { SettingGroup, SettingField, ToggleGroup, ColorInput } from "./shared/SettingComponents";

interface CommonSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function CommonSettings({ selectedItem, updateProp }: CommonSettingsProps) {
  const { props: p } = selectedItem;

  return (
    <>
      <SettingGroup title="Alignment & Padding" icon={<Move size={12} className="text-blue-500" />}>
        <div className="grid grid-cols-2 gap-3">
          <SettingField label="Align">
            <ToggleGroup 
              options={['left', 'center', 'right']} 
              value={p.align || 'left'} 
              onChange={(val) => updateProp('align', val)} 
            />
          </SettingField>
          <SettingField label="Padding Y">
            <input 
              type="number"
              value={p.paddingY}
              onChange={(e) => updateProp('paddingY', parseInt(e.target.value))}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
            />
          </SettingField>
        </div>
      </SettingGroup>

      <SettingGroup title="Visual Style" icon={<Palette size={12} className="text-pink-500" />}>
        <div className="space-y-4">
          <SettingField label="Text Color">
            <ColorInput value={p.color} onChange={(val) => updateProp('color', val)} />
          </SettingField>
          <SettingField label="Background">
            <ColorInput 
              value={p.bgColor} 
              onChange={(val) => updateProp('bgColor', val)} 
              onClear={() => updateProp('bgColor', 'transparent')} 
            />
          </SettingField>
        </div>
      </SettingGroup>
    </>
  );
}
