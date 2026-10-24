import { Terminal, Palette } from "lucide-react";
import type { BuilderItem } from "@/types/builder";

interface CodeSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function CodeSettings({ selectedItem, updateProp }: CodeSettingsProps) {
  const colors = [
    '#f3f4f6', 
    '#fee2e2', 
    '#fef3c7', 
    '#dcfce7', 
    '#dbeafe', 
    '#e0e7ff', 
    '#f5f3ff', 
    '#fae8ff', 
    '#ffffff', 
    'transparent', 
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Terminal size={12} className="text-blue-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Code Snippet</h3>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Snippet Text</label>
            <input 
              type="text"
              value={selectedItem.props.text}
              onChange={(e) => updateProp('text', e.target.value)}
              placeholder="e.g. react-email"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] text-blue-600 focus:outline-none shadow-inner font-mono font-bold"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Palette size={12} className="text-pink-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Appearance</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Background Color</label>
            <div className="grid grid-cols-5 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 shadow-inner">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => updateProp('bgColor', c)}
                  className={`w-full aspect-square rounded-md border border-gray-200 transition-all hover:scale-110 flex items-center justify-center ${selectedItem.props.bgColor === c ? 'ring-2 ring-blue-500 ring-offset-1 border-transparent' : ''}`}
                  style={{ backgroundColor: c === 'transparent' ? undefined : c }}
                >
                  {c === 'transparent' && <span className="text-[10px] text-gray-400 font-bold">✕</span>}
                </button>
              ))}
              <input
                type="color"
                value={selectedItem.props.bgColor || '#f3f4f6'}
                onChange={(e) => updateProp('bgColor', e.target.value)}
                className="w-full aspect-square rounded-md cursor-pointer border border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Text Color</label>
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-inner">
              <input 
                type="color"
                value={selectedItem.props.color || '#3b82f6'}
                onChange={(e) => updateProp('color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
              />
              <span className="text-[10px] font-mono text-gray-400 uppercase">{selectedItem.props.color || '#3b82f6'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
