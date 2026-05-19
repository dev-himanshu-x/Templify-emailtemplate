import { toast } from 'sonner';
import { useRef } from 'react';
import { validateUrl } from '@/lib/utils';
import { List as ListIcon, Plus, Trash2, Image as ImageIcon, Type } from "lucide-react";
import type { BuilderItem, ListItem } from "@/types/builder";

interface ListSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function ListSettings({ selectedItem, updateProp }: ListSettingsProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  const updateListItem = (index: number, field: keyof ListItem, value: any) => {
    const newItems = [...(selectedItem.props.listItems || [])];
    if (newItems[index]) {
      newItems[index] = { ...newItems[index], [field]: value };
      updateProp('listItems', newItems);

      // Trigger image validation if URL changed
      if (field === 'imageUrl' && value && value.trim() !== '') {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
          if (toastIdRef.current) toast.dismiss(toastIdRef.current);
          
          const img = new window.Image();
          img.onerror = () => {
            toastIdRef.current = toast.error(`Step ${index + 1} image failed to load`, {
              description: "The URL did not return a valid image.",
              duration: 3000,
            });
          };
          img.src = value;
        }, 700);
      }
    }
  };

  const addListItem = () => {
    const newItems = [...(selectedItem.props.listItems || [])];
    newItems.push({
      number: newItems.length + 1,
      title: "New Item",
      description: "Item description goes here.",
      imageUrl: ""
    });
    updateProp('listItems', newItems);
  };

  const removeListItem = (index: number) => {
    const newItems = [...(selectedItem.props.listItems || [])];
    newItems.splice(index, 1);
    const renumbered = newItems.map((item, i) => ({ ...item, number: i + 1 }));
    updateProp('listItems', renumbered);
  };

  return (
    <div className="space-y-8">
      
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Type size={12} className="text-blue-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Global Styles</h3>
        </div>
        
        <div className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Section Title</label>
            <input 
              type="text"
              value={selectedItem.props.text || ''}
              onChange={(e) => updateProp('text', e.target.value)}
              placeholder="e.g. How it Works"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Theme Color</label>
              <input
                type="color"
                value={selectedItem.props.bgColor || '#3b82f6'}
                onChange={(e) => updateProp('bgColor', e.target.value)}
                className="h-8 w-full rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Title Color</label>
              <input
                type="color"
                value={selectedItem.props.titleColor || '#111827'}
                onChange={(e) => updateProp('titleColor', e.target.value)}
                className="h-8 w-full rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Title Size</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateProp('titleFontSize', Math.max(12, (selectedItem.props.titleFontSize || 22) - 1))}
                  className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm"
                >
                  −
                </button>
                <span className="text-[10px] font-bold text-gray-600 font-mono flex-1 text-center">{selectedItem.props.titleFontSize || 22}px</span>
                <button 
                  onClick={() => updateProp('titleFontSize', Math.min(48, (selectedItem.props.titleFontSize || 22) + 1))}
                  className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Text Size</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateProp('descriptionFontSize', Math.max(10, (selectedItem.props.descriptionFontSize || 16) - 1))}
                  className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm"
                >
                  −
                </button>
                <span className="text-[10px] font-bold text-gray-600 font-mono flex-1 text-center">{selectedItem.props.descriptionFontSize || 16}px</span>
                <button 
                  onClick={() => updateProp('descriptionFontSize', Math.min(32, (selectedItem.props.descriptionFontSize || 16) + 1))}
                  className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-gray-900">
            <ListIcon size={12} className="text-rose-500" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest">List Items</h3>
          </div>
        </div>

        <div className="space-y-4">
          {(selectedItem.props.listItems || []).map((item, index) => (
            <div key={index} className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 space-y-3 relative group">
              <button
                onClick={() => removeListItem(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
              >
                <Trash2 size={10} />
              </button>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-400 shrink-0 shadow-sm">
                  {item.number}
                </div>
                <input 
                  type="text"
                  value={item.title}
                  onChange={(e) => updateListItem(index, 'title', e.target.value)}
                  placeholder="Step Title"
                  className="flex-1 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-300 text-xs font-bold text-gray-700 focus:outline-none transition-colors py-1"
                />
              </div>

              <div className="space-y-2">
                <textarea 
                  value={item.description}
                  onChange={(e) => updateListItem(index, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-white border border-gray-100 rounded-lg p-2 text-[11px] text-gray-600 focus:outline-none focus:border-blue-200 transition-colors shadow-sm resize-none"
                />
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Image URL (Optional)</label>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-200">
                      <ImageIcon size={10} />
                    </div>
                    <input 
                      type="text"
                      value={item.imageUrl || ''}
                      onChange={(e) => updateListItem(index, 'imageUrl', e.target.value)}
                      onBlur={(e) => validateUrl(e.target.value)}
                      placeholder="Paste image URL here..."
                      className="flex-1 bg-white border border-gray-100 rounded-md px-2 py-1.5 text-[9px] font-mono text-blue-600 focus:outline-none focus:border-blue-200 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={addListItem}
            className="w-full py-2.5 bg-white border border-dashed border-gray-300 rounded-xl text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            <Plus size={12} /> Add New Step
          </button>
        </div>
      </section>
    </div>
  );
}
