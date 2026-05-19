import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { Image as ImageIcon } from "lucide-react";
import type { BuilderItem } from "@/types/builder";

interface BannerSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function BannerSettings({ selectedItem, updateProp }: BannerSettingsProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const url = selectedItem.props.imageUrl;
    if (!url || url.trim() === '') return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);

      const img = new window.Image();

      img.onerror = () => {
        toastIdRef.current = toast.error("Banner image failed to load", {
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
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 mb-1">
          <ImageIcon size={12} className="text-emerald-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Banner Content</h3>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Source URL</label>
          <input 
            type="text"
            value={selectedItem.props.imageUrl || ''}
            onChange={(e) => updateProp('imageUrl', e.target.value)}
            placeholder="https://..."
            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[10px] text-blue-600 focus:outline-none shadow-inner font-mono"
          />
        </div>
      </section>
    </div>
  );
}
