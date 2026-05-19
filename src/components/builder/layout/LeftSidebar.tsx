import { cn } from "@/lib/utils";
import { BLOCK_CATEGORIES } from "@/config/blocks";
import { TemplateBlock } from "./TemplateBlock";
export function LeftSidebar() {
	return (
		<div className="w-72 border-r border-gray-200 bg-white flex flex-col h-full overflow-hidden shrink-0 z-10">
			<div className="p-5 border-b border-gray-100">
				<h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-tight">Components</h2>
				<p className="text-[11px] text-gray-400 mt-1">Drag and drop to build your template</p>
			</div>
			<div className="flex-1 overflow-y-auto p-5">
				<div className="space-y-8">
					{BLOCK_CATEGORIES.map((category) => (
						<div key={category.id}>
							<div className={cn("flex items-center gap-2 mb-4", category.colorClass)}>
								{category.icon}
								<h3 className="text-[11px] font-bold uppercase tracking-widest">{category.title}</h3>
							</div>
							<div className="grid grid-cols-2 gap-3">
								{category.blocks.map((block) => (
									<TemplateBlock
										key={block.type}
										type={block.type}
										label={block.label}
										icon={block.icon}
										defaultProps={block.defaultProps}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
