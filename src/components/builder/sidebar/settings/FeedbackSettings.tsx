import { Star } from "lucide-react";
import type { BuilderItem } from "@/types/builder";
interface FeedbackSettingsProps {
  selectedItem: BuilderItem;
  updateProp: (key: string, value: any) => void;
}
export function FeedbackSettings({ selectedItem, updateProp }: FeedbackSettingsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-gray-900 mb-1">
        <Star size={12} className="text-rose-500" />
        <h3 className="text-[11px] font-bold uppercase tracking-widest">Feedback Settings</h3>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Main Heading</label>
          <textarea 
            value={selectedItem.props.text}
            onChange={(e) => updateProp('text', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner min-h-[60px] resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Subheading / Description</label>
          <textarea 
            value={selectedItem.props.title}
            onChange={(e) => updateProp('title', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner min-h-[60px] resize-none"
          />
        </div>
        {selectedItem.type !== 'FeedbackSurvey' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Call to Action / Question</label>
            <input 
              type="text"
              value={selectedItem.props.linkText}
              onChange={(e) => updateProp('linkText', e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
            />
          </div>
        )}
      </div>
    </section>
  );
}
