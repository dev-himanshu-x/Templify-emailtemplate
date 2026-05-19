import { useBuilder } from "@/context/builder-context";
import { Settings2, X, Image as ImageIcon } from "lucide-react";

import { TextSettings } from "../sidebar/settings/TextSettings";
import { ButtonSettings } from "../sidebar/settings/ButtonSettings";
import { ImageSettings } from "../sidebar/settings/ImageSettings";
import { FeedbackSettings } from "../sidebar/settings/FeedbackSettings";
import { ListSettings } from "../sidebar/settings/ListSettings";
import { FooterSettings } from "../sidebar/settings/FooterSettings";
import { AvatarSettings } from "../sidebar/settings/AvatarSettings";
import { CodeSettings } from "../sidebar/settings/CodeSettings";
import { InlineSnippetSettings } from "../sidebar/settings/InlineSnippetSettings";


import { InlineLinkSettings } from "../sidebar/settings/InlineLinkSettings";
import { BannerSettings } from "../sidebar/settings/BannerSettings";
import { DividerSettings } from "../sidebar/settings/DividerSettings";

export function RightSidebar() {
	const { items, selectedId, selectItem, updateItemProps, editingMode, setEditingMode } = useBuilder();
	const selectedItem = items.find((i) => i.id === selectedId);
	const isLayout = selectedItem?.type.startsWith('Layout');

	if (!selectedId || !selectedItem || isLayout) {
		return (
			<div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden shrink-0 z-10 items-center justify-center p-8 text-center">
				<div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
					<Settings2 size={24} />
				</div>
				<h3 className="text-sm font-bold text-gray-900">{isLayout ? "Layout Selected" : "No selection"}</h3>
				<p className="text-xs text-gray-400 mt-1 leading-relaxed">
					{isLayout 
						? "Grid layouts cannot be edited directly. Drop components into the columns to start building." 
						: "Select any element on the canvas to edit its properties"}
				</p>
			</div>
		);
	}

	const updateProp = (key: string, value: any) => {
		updateItemProps(selectedId, { [key]: value });
	};

	const renderSettings = () => {
		const type = selectedItem.type;

		if (editingMode.type === 'inline-snippet') {
			return (
				<div className="p-5">
					<InlineSnippetSettings 
						selectedItem={selectedItem} 
						editingMode={editingMode}
						updateProp={updateProp} 
						onBack={() => setEditingMode({ type: 'block' })}
						setEditingMode={setEditingMode}
					/>
				</div>
			);
		}

		if (editingMode.type === 'inline-link') {
			return (
				<div className="p-5">
					<InlineLinkSettings 
						selectedItem={selectedItem} 
						editingMode={editingMode}
						updateProp={updateProp} 
						onBack={() => setEditingMode({ type: 'block' })}
					/>
				</div>
			);
		}

		return (
			<div className="p-5 space-y-6">
				{(type === 'Heading' || type === 'Text' || type === 'Link') && (
					<TextSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}

				{(type.startsWith('Button')) && (
					<ButtonSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
				{(type === 'Img' || type.startsWith('Header')) && (
					<ImageSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
				{(type.startsWith('Feedback')) && (
					<FeedbackSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
				{(type.startsWith('List')) && (
					<ListSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
				{(type.startsWith('Footer')) && (
					<FooterSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
				{(type === 'Avatar') && (
					<AvatarSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
				{(type === 'CodeInline') && (
					<CodeSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
				{(type === 'Banner') && (
					<BannerSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
				{(type === 'Hr' || type === 'Divider') && (
					<DividerSettings selectedItem={selectedItem} updateProp={updateProp} />
				)}
			</div>
		);
	};

	return (
		<div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden shrink-0 z-10">
			<div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
				<div className="flex items-center">
					<div>
						<h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-tight">Properties</h2>
						<p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
							{editingMode.type === 'inline-snippet' ? 'Inline Snippet' : selectedItem.type}
						</p>
					</div>
				</div>
				<button 
					onClick={() => selectItem(null)}
					className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
				>
					<X size={14} />
				</button>
			</div>
			<div className="flex-1 overflow-y-auto">
				{renderSettings()}
			</div>
		</div>
	);
}
