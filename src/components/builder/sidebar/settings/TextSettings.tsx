import { cn, validateUrl } from "@/lib/utils";
import React, { useState, useEffect, useMemo, useRef } from "react";

import { Type, Terminal, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Smile, Search, User } from "lucide-react";
import type { BuilderItem } from "@/types/builder";

interface TextSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

function VariableButton({ label, variable, onSelect }: { label: string, variable: string, onSelect: (v: string) => void }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(`{{${variable}}}`);
      }}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all shadow-sm group"
    >
      <div className="w-4 h-4 rounded bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <User size={10} className="text-gray-400 group-hover:text-blue-600" />
      </div>
      <span>{label}</span>
      <code className="ml-auto text-[10px] text-gray-400 font-mono">{`{{${variable}}}`}</code>
    </button>
  );
}

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [emojis, setEmojis] = useState<{char: string, name: string}[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('https://unpkg.com/emoji.json@14.0.0/emoji.json')
      .then(res => res.json())
      .then(data => setEmojis(data))
      .catch(err => console.error(err));
  }, []);

  const filteredEmojis = useMemo(() => {
    if (!search) return emojis.slice(0, 80); 
    return emojis.filter(e => e.name.toLowerCase().includes(search.toLowerCase())).slice(0, 80);
  }, [search, emojis]);

  return (
    <div className="flex flex-col gap-2 border border-gray-100 rounded-lg p-2 bg-gray-50 shadow-inner mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search emojis..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-[11px] p-1.5 pl-7 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />
        <Search size={12} className="absolute left-2.5 top-2 text-gray-400" />
      </div>
      <div className="grid grid-cols-8 gap-1 h-36 overflow-y-auto p-0.5 custom-scrollbar">
        {filteredEmojis.map((emoji, i) => (
          <button 
            key={i} 
            title={emoji.name}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(emoji.char);
            }}
            className="text-lg hover:bg-gray-200 rounded-md flex items-center justify-center p-1 transition-colors"
          >
            {emoji.char}
          </button>
        ))}
        {filteredEmojis.length === 0 && (
          <div className="col-span-8 text-center text-xs text-gray-400 py-4">No emojis found</div>
        )}
      </div>
    </div>
  );
}

export function TextSettings({ selectedItem, updateProp }: TextSettingsProps) {
  const [localText, setLocalText] = useState(selectedItem.props.text || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    setLocalText(selectedItem.props.text || "");
  }, [selectedItem.id]);

  const timerRef = useRef<any>(null);

  const handleTextChange = (value: string) => {
    setLocalText(value);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateProp('text', value);
    }, 150);
  };

  const handleInsert = (content: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const value = textarea.value;
      let start = textarea.selectionStart;
      let end = textarea.selectionEnd;

      // If the textarea is not focused, or selection is at the very beginning but there's text,
      // we default to appending at the end to avoid the "adding at start" frustration.
      if ((document.activeElement !== textarea || (start === 0 && end === 0)) && value.length > 0) {
        start = end = value.length;
      }
      
      const newText = value.substring(0, start) + content + value.substring(end);
      
      setLocalText(newText);
      updateProp('text', newText);
      
      // Force update textarea value immediately to maintain cursor control
      textarea.value = newText;
      
      setTimeout(() => {
        textarea.focus();
        const newPos = start + content.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    } else {
      const newText = localText + content;
      setLocalText(newText);
      updateProp('text', newText);
    }
  };

  return (
    <div className="space-y-8">
      {/* Text Content Section */}
      <section className="space-y-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <Type size={12} className="text-blue-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Text Content</h3>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                {selectedItem.type === 'Link' ? 'Display Text (Permanent)' : 'Content'}
              </label>
            </div>
            <textarea 
              ref={textareaRef}
              value={localText}
              onChange={(e) => selectedItem.type !== 'Link' && handleTextChange(e.target.value)}
              onBlur={() => updateProp('text', localText)}
              readOnly={selectedItem.type === 'Link'}
              className={`w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs focus:outline-none transition-all shadow-inner min-h-[80px] resize-none ${
                selectedItem.type === 'Link' ? 'text-gray-400 cursor-not-allowed opacity-70' : 'text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500'
              }`}
            />
          </div>

          {selectedItem.type === 'Link' && (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-gray-900 mb-1">
                <LinkIcon size={12} className="text-blue-500" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Destination URL</label>
              </div>
              <input 
                type="text"
                value={selectedItem.props.href}
                placeholder="https://..."
                onChange={(e) => updateProp('href', e.target.value)}
                onBlur={(e) => validateUrl(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner font-mono"
              />
            </div>
          )}
            <div className="grid grid-cols-2 gap-3">
              {selectedItem.type !== 'Link' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Alignment</label>
                  <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100 shadow-inner">
                    {(['left', 'center', 'right'] as const).map((a) => (
                      <button
                        key={a}
                        onClick={() => updateProp('align', a)}
                        className={cn(
                          "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all",
                          (selectedItem.props.align || 'left') === a 
                            ? "bg-white text-blue-600 shadow-sm border border-gray-100" 
                            : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        {a === 'left' && <AlignLeft size={14} />}
                        {a === 'center' && <AlignCenter size={14} />}
                        {a === 'right' && <AlignRight size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Font Size</label>
                <input 
                  type="number"
                  value={selectedItem.props.fontSize}
                  onChange={(e) => updateProp('fontSize', parseInt(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs text-gray-900 focus:outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Weight</label>
                <select
                  value={selectedItem.props.fontWeight}
                  onChange={(e) => updateProp('fontWeight', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs text-gray-900 focus:outline-none shadow-inner appearance-none"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>
          </div>
        </section>

      {/* Variables Section */}
      {selectedItem.type !== 'Link' && (
        <section className="space-y-4 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 mb-1">
            <User size={12} className="text-green-500" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Variables</h3>
          </div>
          <p className="text-[9px] text-gray-400 italic leading-relaxed px-1">
            Insert dynamic placeholders that will be replaced with actual recipient data when the email is sent.
          </p>
          <div className="grid grid-cols-1 gap-2">
            <VariableButton label="Recipient Name" variable="name" onSelect={handleInsert} />
          </div>
        </section>
      )}

      {/* Emoji Section */}
      {selectedItem.type !== 'Link' && (
        <section className="space-y-4 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 mb-1">
            <Smile size={12} className="text-yellow-500" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Emojis</h3>
          </div>
          <p className="text-[9px] text-gray-400 italic leading-relaxed px-1">
            Click an emoji to insert it at your cursor position in the text content above.
          </p>
          <EmojiPicker onSelect={handleInsert} />
        </section>
      )}
    </div>
  );
}
