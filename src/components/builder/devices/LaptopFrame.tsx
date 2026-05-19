import { useBuilder } from "@/context/builder-context";
import { BuilderSlot } from "../BuilderSlot";

export function LaptopFrame() {
    const { selectItem } = useBuilder();

    return (
        <div
            className="flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-500 w-[min(1200px,calc(100%-4rem))] h-[calc(100vh-140px)] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_30px_60px_rgba(0,0,0,0.12),0_15px_30px_rgba(0,0,0,0.08)]"
        >
            <div
                className="h-14 border-b border-gray-100 flex items-center px-6 gap-6 shrink-0 select-none bg-[#fcfcfd]"
            >
                <div className="flex gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black/5 hover:opacity-80 transition-opacity" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/5 hover:opacity-80 transition-opacity" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-black/5 hover:opacity-80 transition-opacity" />
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto bg-[#F8FAFC] relative flex flex-col min-h-0 p-2"
                onClick={(e) => {
                    e.stopPropagation();
                    selectItem(null);
                }}
            >
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 p-2" />
                <BuilderSlot />
            </div>
        </div>
    );
}