import React from "react";

import { useEffect, useState } from "react";
import { BuilderProvider } from "@/context/builder-context";
import { BuilderLayout } from "./BuilderLayout";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return (
			<div className="flex flex-col h-screen w-screen bg-[#f9fafb] animate-pulse" />
		);
	}

	return (
		<>
			<Toaster
				position="top-center"
				richColors
				expand={true}
				duration={4000}
			/>
			<DndWrapper>
				<BuilderProvider>
					<BuilderLayout />
					{children}
				</BuilderProvider>
			</DndWrapper>
		</>
	);
}

function DndWrapper({ children }: { children: React.ReactNode }) {
	const [DndProvider, setDndProvider] = useState<any>(null);
	const [HTML5Backend, setHTML5Backend] = useState<any>(null);

	useEffect(() => {
		const loadDnd = () => {
			Promise.all([
				import("react-dnd"),
				import("react-dnd-html5-backend")
			]).then(([dnd, backend]) => {
				setDndProvider(() => dnd.DndProvider);
				setHTML5Backend(() => backend.HTML5Backend);
			}).catch((err) => {
				console.error("Failed to load DnD:", err);
			});
		};
		loadDnd();
	}, []);

	if (!DndProvider || !HTML5Backend) {
		return <div className="flex flex-col h-screen w-screen bg-[#f9fafb] animate-pulse" />;
	}

	return (
		<DndProvider backend={HTML5Backend}>
			{children}
		</DndProvider>
	);
}
