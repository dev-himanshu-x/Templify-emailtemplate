import { BuilderSlot } from "../BuilderSlot";

export function TabletFrame() {
    // iPad Pro 11": 834x1194 screen, flat aluminium frame, uniform bezel
    return (
        <div className="flex flex-col items-center justify-center py-10 w-full select-none">
            <div className="relative shrink-0 transition-all duration-500 w-[834px] h-[1194px] max-w-[calc(100vw-80px)] max-h-[calc(100vh-120px)]">
                {/* Top button and volume rocker */}
                <div className="absolute top-[-3px] left-[40px] w-[44px] h-[4px] rounded-t-[3px] bg-gradient-to-t from-[#555] to-[#8a8a8f]" />
                <div className="absolute top-[-3px] right-[90px] w-[44px] h-[4px] rounded-t-[3px] bg-gradient-to-t from-[#555] to-[#8a8a8f]" />
                <div className="absolute right-[-3px] top-[110px] w-[4px] h-[56px] rounded-r-[3px] bg-gradient-to-l from-[#555] to-[#8a8a8f]" />

                {/* Aluminium frame */}
                <div className="absolute inset-0 rounded-[44px] bg-gradient-to-b from-[#9a9a9f] via-[#5c5c61] to-[#8a8a8f] p-[3px] shadow-[0_60px_120px_rgba(0,0,0,0.4)]">
                    {/* Black bezel */}
                    <div className="relative w-full h-full rounded-[41px] bg-black p-[18px]">
                        {/* Front camera */}
                        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#1a1a24] ring-1 ring-[#2a2a35]" />

                        <div className="relative flex flex-col w-full h-full overflow-hidden rounded-[24px] bg-[#F8FAFC]">
                            {/* Status bar */}
                            <div className="h-[24px] shrink-0 flex items-center justify-between px-[26px] text-[12px] font-semibold text-black z-10">
                                <span>9:41 <span className="ml-2 font-medium">Mon Oct 24</span></span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <span>100%</span>
                                    <svg width="25" height="12" viewBox="0 0 27 13" aria-hidden="true">
                                        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
                                        <rect x="2" y="2" width="20" height="9" rx="2.200" fill="currentColor" />
                                    </svg>
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto flex flex-col min-h-0 relative">
                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
                                <BuilderSlot />
                            </div>

                            {/* Home Indicator */}
                            <div className="h-[22px] flex items-center justify-center shrink-0">
                                <div className="w-[160px] h-[5px] bg-black rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
