import { BuilderSlot } from "../BuilderSlot";

export function TabletFrame() {
    const FRAME_W = 834;
    const FRAME_H = 1194;

    return (
        <div className="flex flex-col items-center justify-center py-10 w-full select-none">
            <div
                className="relative flex flex-col shrink-0 transition-all duration-500 w-[834px] h-[1194px] max-w-[calc(100vw-80px)] max-h-[calc(100vh-120px)] rounded-[36px] bg-black shadow-[inset_0_0_0_1px_#333,inset_0_0_0_3px_#111,0_0_0_1px_#000,0_60px_120px_rgba(0,0,0,0.4)] p-[20px]"
            >
                {/* Buttons */}
                <div className="absolute top-[-2px] right-[80px] w-[50px] h-[3px] bg-[#222] rounded-b-[3px]" />
                <div className="absolute right-[-2px] top-[120px] w-[3px] h-[44px] bg-[#222] rounded-l-[3px]" />
                <div className="absolute right-[-2px] top-[174px] w-[3px] h-[44px] bg-[#222] rounded-l-[3px]" />

                <div
                    className="flex-1 flex flex-col overflow-hidden relative bg-[#F8FAFC] rounded-[22px]"
                >
                    <div className="flex-1 overflow-y-auto flex flex-col min-h-0 relative">
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
                        <BuilderSlot />
                    </div>

                    {/* Home Indicator */}
                    <div className="h-8 flex items-center justify-center shrink-0">
                        <div className="w-40 h-1.5 bg-black/10 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}