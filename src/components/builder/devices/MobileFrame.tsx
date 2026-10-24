import { BuilderSlot } from "../BuilderSlot";

export function MobileFrame() {
    // iPhone-style frame: 393px wide, a little taller than the real 852px so more of the email is visible
    return (
        <div className="flex flex-col items-center justify-center py-4 w-full select-none">
            <div className="relative shrink-0 transition-all duration-500 w-[393px] h-[980px] max-w-[min(393px,calc(100vw-60px))] max-h-[calc(100vh-88px)]">
                {/* Side buttons: action, volume up, volume down, power */}
                <div className="absolute left-[-3px] top-[110px] w-[4px] h-[28px] rounded-l-[3px] bg-gradient-to-r from-[#555] to-[#8a8a8f]" />
                <div className="absolute left-[-3px] top-[165px] w-[4px] h-[56px] rounded-l-[3px] bg-gradient-to-r from-[#555] to-[#8a8a8f]" />
                <div className="absolute left-[-3px] top-[235px] w-[4px] h-[56px] rounded-l-[3px] bg-gradient-to-r from-[#555] to-[#8a8a8f]" />
                <div className="absolute right-[-3px] top-[200px] w-[4px] h-[88px] rounded-r-[3px] bg-gradient-to-l from-[#555] to-[#8a8a8f]" />

                {/* Titanium frame */}
                <div className="absolute inset-0 rounded-[58px] bg-gradient-to-b from-[#9a9a9f] via-[#5c5c61] to-[#8a8a8f] p-[2px] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
                    {/* Black bezel */}
                    <div className="relative w-full h-full rounded-[56px] bg-black p-[7px]">
                        {/* Screen */}
                        <div className="relative flex flex-col w-full h-full overflow-hidden rounded-[49px] bg-white">
                            {/* Dynamic Island */}
                            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-[120px] h-[35px] bg-black rounded-full" />

                            {/* Status bar */}
                            <div className="absolute top-0 inset-x-0 h-[54px] z-50 pointer-events-none flex items-center justify-between px-[34px] pt-[4px] text-black">
                                <span className="text-[16px] font-semibold tracking-tight">9:41</span>
                                <div className="flex items-center gap-[6px]">
                                    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
                                        <rect x="0" y="8" width="3" height="4" rx="1" />
                                        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                                        <rect x="10" y="3" width="3" height="9" rx="1" />
                                        <rect x="15" y="0" width="3" height="12" rx="1" />
                                    </svg>
                                    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true">
                                        <path d="M8.5 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.6 10.6 0 0 0 8.5.5C5.7.5 3.2 1.6 1.4 3.400l1.1 1.200A8.9 8.9 0 0 1 8.5 2.200Zm0 3.400c1.4 0 2.7.5 3.7 1.400l1.1-1.200a7.2 7.2 0 0 0-9.6 0L4.8 7c1-.9 2.3-1.4 3.7-1.400Zm0 3.300c-.7 0-1.3.3-1.8.7L8.5 11.500l1.8-1.900c-.5-.4-1.1-.7-1.8-.7Z" />
                                    </svg>
                                    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
                                        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
                                        <rect x="2" y="2" width="20" height="9" rx="2.2" fill="currentColor" />
                                        <path d="M25 4.500v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2Z" fill="currentColor" opacity="0.5" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto flex flex-col min-h-0 relative pt-[50px]">
                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
                                <BuilderSlot />
                            </div>

                            {/* Home Indicator */}
                            <div className="h-[22px] flex items-center justify-center shrink-0 bg-white">
                                <div className="w-[140px] h-[5px] bg-black rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
