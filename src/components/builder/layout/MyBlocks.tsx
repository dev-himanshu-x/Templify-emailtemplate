import { Bookmark, Plus, Trash2 } from "lucide-react";
import { useBuilder } from "@/context/builder-context";
import { blockLibrary } from "@/lib/library";

/** Blocks the user saved from the canvas, ready to add to any email. */
export function MyBlocks() {
	const { insertItems } = useBuilder();
	const blocks = blockLibrary.useEntries();

	return (
		<div>
			<div className="flex items-center gap-2 mb-4 text-amber-600">
				<Bookmark size={14} />
				<h3 className="text-[11px] font-bold uppercase tracking-widest">My blocks</h3>
			</div>
			{blocks.length === 0 ? (
				<p className="text-[11px] leading-relaxed text-gray-400">Select a block on the canvas and click the bookmark icon to save it here for reuse.</p>
			) : (
				<ul className="space-y-1.5">
					{blocks.map((b) => (
						<li key={b.id} className="group flex items-center gap-1 rounded-lg border border-gray-100 bg-white pr-1.5 hover:border-blue-200">
							<button type="button" onClick={() => insertItems(b.items)} title="Add to the end of the email" className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left">
								<Plus size={12} className="shrink-0 text-gray-400 group-hover:text-blue-600" />
								<span className="min-w-0">
									<span className="block truncate text-[12px] font-medium text-gray-800">{b.name}</span>
									<span className="block text-[10px] text-gray-400">{b.items.length === 1 ? "1 block" : `${b.items.length} blocks`}</span>
								</span>
							</button>
							<button
								type="button"
								title="Delete saved block"
								aria-label={`Delete saved block ${b.name}`}
								onClick={() => window.confirm(`Delete "${b.name}"?`) && blockLibrary.remove(b.id)}
								className="rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500"
							>
								<Trash2 size={12} />
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
