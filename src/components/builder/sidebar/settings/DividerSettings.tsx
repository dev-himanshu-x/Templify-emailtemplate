import React from "react";
import { Maximize, Palette, Minus } from "lucide-react";
import type { BuilderItem } from "@/types/builder";

interface DividerSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function DividerSettings({ selectedItem, updateProp }: DividerSettingsProps) {
  const p = selectedItem.props;

  return (
    <div className="space-y-8">
      {/* Visual Style Section */}
      <section className="space-y-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Palette size={12} className="text-pink-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Visual Style</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Line Color</label>
            <div className="flex gap-2">
              <input 
                type="color"
                value={p.color || "#d1d5db"}
                onChange={(e) => updateProp('color', e.target.value)}
                className="h-8 w-12 rounded-lg border border-gray-100 cursor-pointer shadow-sm p-0.5 bg-white"
              />
              <input 
                type="text"
                value={p.color || "#d1d5db"}
                onChange={(e) => updateProp('color', e.target.value)}
                className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-lg px-2 text-[10px] font-mono text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 ml-1">
              <Minus size={10} className="text-gray-400" />
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thickness</label>
            </div>
            <div className="relative">
              <input 
                type="number"
                min="1"
                max="10"
                value={p.thickness || 1}
                onChange={(e) => updateProp('thickness', parseInt(e.target.value) || 1)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner pl-3"
              />
              <span className="absolute right-3 top-2 text-[10px] text-gray-400 font-medium">px</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
