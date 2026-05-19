import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Maximize2, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import type { BuilderItem } from "@/types/builder";
import { cn, validateUrl } from "@/lib/utils";

interface ImageSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function ImageSettings({ selectedItem, updateProp }: ImageSettingsProps) {
  const alignment = selectedItem.props.align || 'center';
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const url = selectedItem.props.imageUrl;
    if (!url || url.trim() === '') return;

    // Clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // Dismiss previous toast
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);

      const img = new window.Image();

      img.onerror = () => {
        toastIdRef.current = toast.error("Image failed to load", {
          description: "The URL did not return a valid image.",
          duration: 3000,
        });
      };

      img.src = url;
    }, 700);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedItem.props.imageUrl]);

  return (
    <div className="space-y-8">
      
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <ImageIcon size={12} className="text-emerald-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Image Content</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source URL</label>
            </div>
            <div className="relative">
              <input 
                type="text"
                value={selectedItem.props.imageUrl || ''}
                onChange={(e) => updateProp('imageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[10px] text-blue-600 focus:outline-none shadow-inner font-mono"
              />
            </div>
          </div>
        </div>
      </section>


      
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Maximize2 size={12} className="text-pink-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Layout & Style</h3>
        </div>

        <div className="space-y-5">
          {!selectedItem.type.startsWith('Header') && (
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
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {selectedItem.type.startsWith('Header') ? 'Width (px)' : 'Width (%)'}
              </label>
              <span className="text-[10px] text-gray-500 font-mono">
                {selectedItem.props.imageWidth || (selectedItem.type.startsWith('Header') ? 120 : 100)}
                {selectedItem.type.startsWith('Header') ? 'px' : '%'}
              </span>
            </div>
            <input 
              type="range"
              min={selectedItem.type.startsWith('Header') ? "20" : "10"}
              max={selectedItem.type.startsWith('Header') ? "600" : "100"}
              step={selectedItem.type.startsWith('Header') ? "5" : "1"}
              value={selectedItem.props.imageWidth || (selectedItem.type.startsWith('Header') ? 120 : 100)}
              onChange={(e) => updateProp('imageWidth', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>



          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rounded Corners</label>
              <span className="text-[10px] text-gray-500 font-mono">{selectedItem.props.borderRadius || 0}px</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={selectedItem.props.borderRadius || 0}
              onChange={(e) => updateProp('borderRadius', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </section>

      
      {selectedItem.type.startsWith('Header') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between text-gray-900 mb-1">
            <div className="flex items-center gap-2">
              <LinkIcon size={12} className="text-blue-500" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest">Navigation Links</h3>
            </div>
            {(selectedItem.props.navLinks || []).length < 4 && (
              <button 
                onClick={() => {
                  const links = [...(selectedItem.props.navLinks || [])];
                  links.push({ text: "New Link", href: "" });
                  updateProp('navLinks', links);
                }}
                className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <Plus size={12} />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {(selectedItem.props.navLinks || []).map((link: any, i: number) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2 relative group">
                <button 
                  onClick={() => {
                    const links = [...(selectedItem.props.navLinks || [])];
                    links.splice(i, 1);
                    updateProp('navLinks', links);
                  }}
                  className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={10} />
                </button>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight ml-1">Label</label>
                  <input 
                    type="text"
                    value={link.text}
                    onChange={(e) => {
                      const links = [...(selectedItem.props.navLinks || [])];
                      links[i] = { ...links[i], text: e.target.value };
                      updateProp('navLinks', links);
                    }}
                    className="w-full bg-white border border-gray-100 rounded p-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500/20 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight ml-1">URL</label>
                  <input 
                    type="text"
                    value={link.href}
                    placeholder="https://..." onBlur={(e) => validateUrl(e.target.value)}
                    onChange={(e) => {
                      const links = [...(selectedItem.props.navLinks || [])];
                      links[i] = { ...links[i], href: e.target.value };
                      updateProp('navLinks', links);
                    }}
                    className="w-full bg-white border border-gray-100 rounded p-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500/20 shadow-sm font-mono text-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
