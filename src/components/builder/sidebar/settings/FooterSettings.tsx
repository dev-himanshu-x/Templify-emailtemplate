import { toast } from 'sonner';
import { useRef } from 'react';
import { validateUrl } from '@/lib/utils';
import { CreditCard, Image as ImageIcon, Share2, Link } from "lucide-react";
import type { BuilderItem, SocialLink } from "@/types/builder";
import { SettingGroup, SettingInput, SettingRange, SettingNumber } from "./shared/SettingComponents";

interface FooterSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}

export function FooterSettings({ selectedItem, updateProp }: FooterSettingsProps) {
  const { props: p } = selectedItem;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  const validateImage = (url: string, label: string) => {
    if (!url || url.trim() === '') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
      const img = new window.Image();
      img.onerror = () => {
        toastIdRef.current = toast.error(`${label} failed to load`, {
          description: "The URL did not return a valid image.",
          duration: 3000,
        });
      };
      img.src = url;
    }, 700);
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...(p.socialLinks || [])];
    if (newLinks[index]) {
      newLinks[index] = { ...newLinks[index], [field]: value };
      updateProp('socialLinks', newLinks);
      if (field === 'imageUrl') validateImage(value, `Social icon ${index + 1}`);
    }
  };

  return (
    <div className="space-y-8">
      <SettingGroup title="Logo Image" icon={<ImageIcon size={12} className="text-emerald-500" />}>
        <SettingInput 
          label="Logo URL" value={p.imageUrl || ''} 
          onChange={(e) => { updateProp('imageUrl', e.target.value); validateImage(e.target.value, "Footer logo"); }} 
          placeholder="https://..." onBlurUrl 
        />
        <SettingRange 
          label="Logo Size" value={p.imageWidth || 36} 
          min={16} max={150} 
          onChange={(val) => updateProp('imageWidth', val)} 
        />
      </SettingGroup>

      <SettingGroup title="Footer Info" icon={<CreditCard size={12} className="text-rose-500" />}>
        <SettingNumber 
          label="Company Name" value={p.fontSize || 16} 
          onChange={(val) => updateProp('fontSize', val)} 
          color={p.textColor || '#111827'} onColorChange={(c) => updateProp('textColor', c)}
        />
        <input 
          type="text" value={p.text} onChange={(e) => updateProp('text', e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner mt-[-8px]"
        />

        <SettingNumber 
          label="Tagline" value={p.titleFontSize || 14} 
          onChange={(val) => updateProp('titleFontSize', val)} 
          color={p.taglineColor || '#6b7280'} onColorChange={(c) => updateProp('taglineColor', c)}
        />
        <input 
          type="text" value={p.title} onChange={(e) => updateProp('title', e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner mt-[-8px]"
        />

        <SettingNumber 
          label="Address" value={p.addressFontSize || 12} 
          onChange={(val) => updateProp('addressFontSize', val)} 
          color={p.addressColor || '#6b7280'} onColorChange={(c) => updateProp('addressColor', c)}
        />
        <input 
          type="text" value={p.linkText} onChange={(e) => updateProp('linkText', e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner mt-[-8px]"
        />

        <SettingNumber 
          label="Contact Link" value={p.contactFontSize || 12} 
          onChange={(val) => updateProp('contactFontSize', val)} 
          color={p.contactColor || '#6b7280'} onColorChange={(c) => updateProp('contactColor', c)}
        />
        <input 
          type="text" value={p.href} onChange={(e) => updateProp('href', e.target.value)}
          placeholder="https://..." onBlur={(e) => validateUrl(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[10px] text-blue-600 focus:outline-none shadow-inner font-mono mt-[-8px]"
        />
      </SettingGroup>

      <SettingGroup title="Social Links" icon={<Share2 size={12} className="text-blue-500" />}>
        <div className="space-y-4">
          {(p.socialLinks || []).map((link, index) => (
            <div key={index} className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 space-y-3 relative group">
              <button
                onClick={() => {
                  const newLinks = [...(p.socialLinks || [])];
                  newLinks.splice(index, 1);
                  updateProp('socialLinks', newLinks);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                &times;
              </button>
              <div className="flex items-center gap-2 pr-6">
                <div className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                  <Link size={12} />
                </div>
                <input 
                  type="text" value={link.alt || ''} onChange={(e) => updateSocialLink(index, 'alt', e.target.value)}
                  placeholder="Platform Name"
                  className="flex-1 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-300 text-[10px] font-bold text-gray-600 uppercase tracking-wider focus:outline-none transition-colors px-1 py-0.5"
                />
              </div>
              <div className="space-y-2">
                <input 
                  type="text" value={link.href || ''} onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                  placeholder="Link URL" onBlur={(e) => validateUrl(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[10px] text-blue-600 focus:outline-none shadow-sm"
                />
                <input 
                  type="text" value={link.imageUrl || ''} onChange={(e) => updateSocialLink(index, 'imageUrl', e.target.value)}
                  placeholder="Icon URL" onBlur={(e) => validateUrl(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[10px] text-blue-600 focus:outline-none shadow-sm font-mono"
                />
              </div>
            </div>
          ))}
          
          {(p.socialLinks || []).length < 4 && (
            <button
              onClick={() => {
                const newLinks = [...(p.socialLinks || [])];
                newLinks.push({ alt: "New Link", href: "https://", imageUrl: "https://img.icons8.com/color/48/000000/link--v1.png" });
                updateProp('socialLinks', newLinks);
              }}
              className="w-full py-2.5 bg-white border border-dashed border-gray-300 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              + Add Social Link
            </button>
          )}
        </div>
      </SettingGroup>
    </div>
  );
}
