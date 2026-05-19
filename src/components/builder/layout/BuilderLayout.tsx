import { BuilderCanvas } from "@/components/builder";
import { TopBar } from "./TopBar";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
export function BuilderLayout() {
	return (
		<div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f9fafb] font-sans text-gray-900">
			<TopBar />
			<div className="flex flex-1 overflow-hidden">
				<LeftSidebar />
				<div className="flex-1 h-full overflow-hidden min-w-0 bg-[#f3f4f6]">
					<BuilderCanvas />
				</div>
				<RightSidebar />
			</div>
		</div>
	);
}
