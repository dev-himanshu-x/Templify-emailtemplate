import { validateUrl } from '@/lib/utils';
import React from "react";

import { Link as LinkIcon, Palette, ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import type { BuilderItem } from "@/types/builder";

interface InlineLinkSettingsProps {
  selectedItem: BuilderItem;
  editingMode: { type: 'inline-link', link: string };
  updateProp: (key: string, value: any) => void;
  onBack: () => void;
}

import { useBuilder } from "@/context/builder-context";

export function InlineLinkSettings({ selectedItem, editingMode, updateProp, onBack }: InlineLinkSettingsProps) {
  const [localUrl, setLocalUrl] = React.useState("");
  const [localText, setLocalText] = React.useState("");
  const { setEditingMode } = useBuilder();

  React.useEffect(() => {
    const match = editingMode.link.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      setLocalText(match[1]);
      setLocalUrl(match[2]);
    }
  }, [editingMode.link]);

  const handleUpdate = (newText: string, newUrl: string) => {
    const currentFullText = selectedItem.props.text || "";
    const newLinkString = `[${newText}](${newUrl})`;
    
    
    
    const newFullText = currentFullText.replace(editingMode.link, newLinkString);
    
    
    updateProp('text', newFullText);
    
    
    setEditingMode({ type: 'inline-link', link: newLinkString });
  };

  const handleDelete = () => {
    const currentText = selectedItem.props.text || "";
    const newText = currentText.replace(editingMode.link, "");
    updateProp('text', newText);
    onBack();
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
          title="Remove this link"
        >
          <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Delete</span>
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <LinkIcon size={12} className="text-blue-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Edit Link</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Link Text</label>
            <input 
              type="text"
              value={localText}
              readOnly
              className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-500 cursor-not-allowed shadow-inner opacity-80"
              title="Link text cannot be edited here"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Destination URL</label>
            </div>
            <input 
              type="text"
              value={localUrl}
              onChange={(e) => {
                setLocalUrl(e.target.value);
                handleUpdate(localText, e.target.value);
              }}
              placeholder="https://..." onBlur={(e) => validateUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner font-mono"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Palette size={12} className="text-pink-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Link Style</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Global Link Color</label>
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-inner">
            <input 
              type="color"
              value={selectedItem.props.linkColor || '#3b82f6'}
              onChange={(e) => updateProp('linkColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
            />
            <span className="text-[10px] font-mono text-gray-400 uppercase">{selectedItem.props.linkColor || '#3b82f6'}</span>
          </div>
          <p className="text-[9px] text-gray-400 italic leading-relaxed px-1 mt-1">
            Color changes apply to all links in this block.
          </p>
        </div>
      </section>
    </div>
  );
}
