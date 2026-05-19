import { validateUrl } from '@/lib/utils';
import { MousePointer2, Link, Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import type { BuilderItem } from "@/types/builder";
import { cn } from "@/lib/utils";

interface ButtonSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function ButtonSettings({ selectedItem, updateProp }: ButtonSettingsProps) {
  const alignment = selectedItem.props.align || 'center';

  return (
    <div className="space-y-8">
      
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <MousePointer2 size={12} className="text-blue-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Button Content</h3>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Button Text</label>
            <input 
              type="text"
              value={selectedItem.props.text}
              onChange={(e) => updateProp('text', e.target.value)}
              placeholder="e.g. Get Started"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Redirect URL</label>
            <div className="relative">
              <Link size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={selectedItem.props.href}
                onChange={(e) => updateProp('href', e.target.value)}
                placeholder="https://..." onBlur={(e) => validateUrl(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 pl-7 text-[10px] text-blue-600 focus:outline-none shadow-inner font-mono"
              />
            </div>
          </div>

          {selectedItem.type === 'ButtonSplit' && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Second Button Text</label>
                <input 
                  type="text"
                  value={selectedItem.props.linkText}
                  onChange={(e) => updateProp('linkText', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Second URL</label>
                <input 
                  type="text"
                  value={selectedItem.props.href2}
                  onChange={(e) => updateProp('href2', e.target.value)}
                  placeholder="https://..."
                  onBlur={(e) => validateUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[10px] text-blue-600 focus:outline-none shadow-inner font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Sec. Background</label>
                  <input
                    type="color"
                    value={selectedItem.props.bgColor2 || '#ffffff'}
                    onChange={(e) => updateProp('bgColor2', e.target.value)}
                    className="h-8 w-full rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Sec. Text Color</label>
                  <input
                    type="color"
                    value={selectedItem.props.color2 || '#111827'}
                    onChange={(e) => updateProp('color2', e.target.value)}
                    className="h-8 w-full rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      
      {selectedItem.type !== 'ButtonAppStore' && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 mb-1">
            <Type size={12} className="text-pink-500" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Button Styling</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Alignment</label>
              <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100 shadow-inner">
                <button
                  onClick={() => updateProp('align', 'left')}
                  className={cn(
                    "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all",
                    alignment === 'left' ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <AlignLeft size={14} />
                </button>
                <button
                  onClick={() => updateProp('align', 'center')}
                  className={cn(
                    "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all",
                    alignment === 'center' ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <AlignCenter size={14} />
                </button>
                <button
                  onClick={() => updateProp('align', 'right')}
                  className={cn(
                    "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all",
                    alignment === 'right' ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <AlignRight size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Background</label>
                <input
                  type="color"
                  value={selectedItem.props.bgColor || '#3b82f6'}
                  onChange={(e) => updateProp('bgColor', e.target.value)}
                  className="h-8 w-full rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Text Color</label>
                <input
                  type="color"
                  value={selectedItem.props.color || '#ffffff'}
                  onChange={(e) => updateProp('color', e.target.value)}
                  className="h-8 w-full rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Font Size</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateProp('fontSize', Math.max(10, (selectedItem.props.fontSize || 16) - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm"
                >
                  −
                </button>
                <div className="flex-1 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-[11px] font-bold text-gray-700 font-mono">{selectedItem.props.fontSize || 16}px</span>
                </div>
                <button 
                  onClick={() => updateProp('fontSize', Math.min(32, (selectedItem.props.fontSize || 16) + 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vertical Padding (Height)</label>
                <span className="text-[10px] text-gray-500 font-mono">{selectedItem.props.paddingY || 14}px</span>
              </div>
              <input 
                type="range"
                min="4"
                max="32"
                value={selectedItem.props.paddingY || 14}
                onChange={(e) => updateProp('paddingY', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corners</label>
                <span className="text-[10px] text-gray-500 font-mono">{selectedItem.props.borderRadius || 0}px</span>
              </div>
              <input 
                type="range"
                min="0"
                max="32"
                value={selectedItem.props.borderRadius || 0}
                onChange={(e) => updateProp('borderRadius', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
