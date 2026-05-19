import { useBuilder } from "@/context/builder-context";
import { LaptopFrame } from "../devices/LaptopFrame";
import { MobileFrame } from "../devices/MobileFrame";
import { TabletFrame } from "../devices/TabletFrame";

export function BuilderCanvas() {
	const { selectItem, viewMode } = useBuilder();

	const renderDevice = () => {
		switch (viewMode) {
			case "laptop":
				return <LaptopFrame />;
			case "tablet":
				return <TabletFrame />;
			case "mobile":
				return <MobileFrame />;
			default:
				return <LaptopFrame />;
		}
	};

	return (
		<div className="flex-1 flex items-center justify-center h-full overflow-hidden relative select-none bg-[#fcfcfd] bg-[radial-gradient(at_0%_0%,rgba(99,102,241,0.03)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(244,63,94,0.02)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(168,85,247,0.03)_0px,transparent_50%),radial-gradient(at_0%_100%,rgba(34,197,94,0.02)_0px,transparent_50%),linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] [background-size:100%_100%,100%_100%,100%_100%,100%_100%,32px_32px,32px_32px]"
			onClick={() => selectItem(null)}
		>
			<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]" />
			{renderDevice()}
		</div>
	);
}
