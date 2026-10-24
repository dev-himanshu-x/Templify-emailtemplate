import { Terminal, Palette, ArrowLeft, Trash2 } from "lucide-react";
import type { BuilderItem } from "@/types/builder";

interface InlineSnippetSettingsProps {
  selectedItem: BuilderItem;
  editingMode: { type: 'inline-snippet', snippet: string };
  updateProp: (key: string, value: any) => void;
  onBack: () => void;
  setEditingMode: (mode: { type: 'block' } | { type: 'inline-snippet', snippet: string } | { type: 'inline-link', link: string }) => void;
}

export function InlineSnippetSettings({ selectedItem, editingMode, updateProp, onBack, setEditingMode }: InlineSnippetSettingsProps) {
  const colors = [
    '#f3f4f6', 
    '#fee2e2', 
    '#fef3c7', 
    '#dcfce7', 
    '#dbeafe', 
    '#e0e7ff', 
    'transparent', 
  ];

  const handleDelete = () => {
    const currentText = selectedItem.props.text || "";
    
    
    const escapedSnippet = editingMode.snippet.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
    const newText = currentText.replace(new RegExp(escapedSnippet), "");
    updateProp('text', newText);
    onBack(); 
  };

  const handleTextChange = (e: any) => {
    const newValue = e.target.value;
    const oldSnippet = editingMode.snippet;
    const newSnippet = `\`${newValue}\``;
    
    const currentText = selectedItem.props.text || "";
    const escapedSnippet = oldSnippet.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
    const newText = currentText.replace(new RegExp(escapedSnippet), newSnippet);
    
    updateProp('text', newText);
    setEditingMode({ type: 'inline-snippet', snippet: newSnippet });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
        </button>

        <button 
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-red-500 hover:bg-red-50 transition-all group"
          title="Remove this snippet"
        >
          <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Delete</span>
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Terminal size={12} className="text-blue-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Selected Snippet</h3>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-1 shadow-sm overflow-hidden flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <input 
            type="text"
            value={editingMode.snippet.slice(1, -1)}
            onChange={handleTextChange}
            className="w-full text-xs text-gray-900 font-mono bg-transparent outline-none px-2 py-1.5"
            placeholder="Snippet text..."
          />
        </div>
        <p className="text-[9px] text-gray-400 italic leading-relaxed px-1">
          Styling applies to all snippets in this block to maintain visual consistency.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Palette size={12} className="text-pink-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Appearance</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Background Color</label>
            <div className="grid grid-cols-7 gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-100 shadow-inner">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => updateProp('snippetBgColor', c)}
                  className={`aspect-square rounded border border-gray-200 transition-all hover:scale-110 flex items-center justify-center ${selectedItem.props.snippetBgColor === c ? 'ring-2 ring-blue-500 ring-offset-1 border-transparent' : ''}`}
                  style={{ backgroundColor: c === 'transparent' ? undefined : c }}
                >
                  {c === 'transparent' && <span className="text-[10px] text-gray-400 font-bold">✕</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Text Color</label>
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-inner">
              <input 
                type="color"
                value={selectedItem.props.snippetColor || '#3b82f6'}
                onChange={(e) => updateProp('snippetColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
              />
              <span className="text-[10px] font-mono text-gray-400 uppercase">{selectedItem.props.snippetColor || '#3b82f6'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
