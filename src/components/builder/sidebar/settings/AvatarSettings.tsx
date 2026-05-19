import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { validateUrl } from '@/lib/utils';
import { User, Move } from "lucide-react";
import type { BuilderItem } from "@/types/builder";
import { SettingGroup, SettingField, ToggleGroup, SettingRange } from "./shared/SettingComponents";

interface AvatarSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function AvatarSettings({ selectedItem, updateProp }: AvatarSettingsProps) {
  const { props: p } = selectedItem;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const url = p.imageUrl;
    if (!url || url.trim() === '') return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
      const img = new window.Image();
      img.onerror = () => {
        toastIdRef.current = toast.error("Profile photo failed to load", {
          description: "The URL did not return a valid image.",
          duration: 3000,
        });
      };
      img.src = url;
    }, 700);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [p.imageUrl]);

  return (
    <div className="space-y-6">
      <SettingGroup title="Avatar Profile" icon={<User size={12} className="text-orange-500" />}>
        <SettingField label="Profile Photo URL">
          <input 
            type="text"
            value={p.imageUrl || ''}
            onChange={(e) => updateProp('imageUrl', e.target.value)}
            onBlur={(e) => validateUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[10px] text-blue-600 focus:outline-none shadow-inner font-mono"
          />
        </SettingField>

        <SettingField label="Full Name">
          <input 
            type="text"
            value={p.text}
            onChange={(e) => updateProp('text', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner"
          />
        </SettingField>

        <SettingField label="Role / Subtitle">
          <input 
            type="text"
            value={p.title}
            onChange={(e) => updateProp('title', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner"
          />
        </SettingField>
      </SettingGroup>

      <SettingGroup title="Appearance" icon={<Move size={12} className="text-blue-500" />}>
        <SettingRange 
          label="Name Size" 
          value={p.nameFontSize || 15} 
          min={10} max={48} 
          onChange={(val) => updateProp('nameFontSize', val)} 
        />
        
        <SettingField label="Alignment">
          <ToggleGroup 
            options={['left', 'center', 'right']} 
            value={p.align || 'left'} 
            onChange={(val) => updateProp('align', val)} 
          />
        </SettingField>

        <SettingField label="Photo Shape">
          <ToggleGroup 
            options={['circle', 'square']} 
            value={p.avatarShape || 'circle'} 
            onChange={(val) => updateProp('avatarShape', val)} 
          />
        </SettingField>

        <SettingRange 
          label="Photo Size" 
          value={p.avatarSize || 48} 
          min={20} max={120} step={2} 
          onChange={(val) => updateProp('avatarSize', val)} 
        />
      </SettingGroup>
    </div>
  );
}
