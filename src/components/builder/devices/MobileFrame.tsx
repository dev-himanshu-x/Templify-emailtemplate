import { BuilderSlot } from "../BuilderSlot";

export function MobileFrame() {
    // iPhone 14 Pro aspect ratio
    const FRAME_W = 393;
    const FRAME_H = 852;

    return (
        <div className="flex flex-col items-center justify-center py-8 w-full select-none">
            <div
                className="relative flex flex-col shrink-0 transition-all duration-500 w-[393px] h-[852px] max-w-[min(393px,calc(100vw-60px))] max-h-[calc(100vh-120px)] rounded-[54px] bg-black shadow-[inset_0_0_0_1px_#333,inset_0_0_0_3px_#111,0_0_0_1px_#000,0_40px_80px_rgba(0,0,0,0.4)] p-[10px]"
            >
                {/* Buttons */}
                <div className="absolute left-[-2px] top-[120px] w-[3px] h-[26px] bg-[#222] rounded-l-[2px]" />
                <div className="absolute left-[-2px] top-[170px] w-[3px] h-[58px] bg-[#222] rounded-l-[2px]" />
                <div className="absolute left-[-2px] top-[242px] w-[3px] h-[58px] bg-[#222] rounded-l-[2px]" />
                <div className="absolute right-[-2px] top-[210px] w-[3px] h-[90px] bg-[#222] rounded-r-[2px]" />

                <div
                    className="flex-1 flex flex-col overflow-hidden relative bg-[#F8FAFC] rounded-[44px]"
                >
                    {/* Dynamic Island */}
                    <div
                        className="absolute top-[10px] left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-[100px] h-[28px] bg-black rounded-[16px]"
                    />

                    <div className="flex-1 overflow-y-auto flex flex-col min-h-0 relative pt-12">
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
                        <BuilderSlot />
                    </div>

                    {/* Home Indicator */}
                    <div className="h-6 flex items-center justify-center shrink-0">
                        <div className="w-32 h-1.5 bg-black/10 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}