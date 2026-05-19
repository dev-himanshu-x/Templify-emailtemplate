import { Section, Row, Column, Text, Img, Tailwind } from "@react-email/components";
import type { BuilderItem } from "@/types/builder";
import { cn } from "@/lib/utils";

export function renderList(item: BuilderItem) {
	const { props: p } = item;
	const paddingY = p.paddingY || 40;
	const paddingX = p.paddingX || 32;
	const themeColor = p.bgColor || '#000000';
	const titleColor = p.titleColor || p.color || '#111827';
	const descColor = p.descriptionColor || '#6b7280';
	const titleSize = p.titleFontSize || 22;
	const descSize = p.descriptionFontSize || 16;

	switch (item.type) {
		case "ListFeatures":
			return (
				<Tailwind>
					<Section 
						style={{ 
							backgroundColor: '#ffffff',
							padding: `${paddingY}px ${paddingX}px`
						}}
						className="w-full"
					>
						{p.text && (
							<Text className="text-center text-[28px] font-bold m-0 mb-10 tracking-tight text-gray-900 leading-tight">
								{p.text}
							</Text>
						)}

						{(p.listItems || []).map((li, i) => {
							const hasImage = li.imageUrl && li.imageUrl.trim().length > 0;

							return (
								<Row key={i} className={cn("align-top", i < (p.listItems?.length ?? 0) - 1 ? 'mb-8' : 'mb-0')}>
									{/* Number badge */}
									<Column className="w-11 align-top pt-1">
										<div 
											style={{ backgroundColor: themeColor }}
											className="w-8 h-8 rounded-full text-white text-sm font-bold text-center leading-8 block"
										>
											{li.number}
										</div>
									</Column>

									{/* Image */}
									{hasImage && (
										<Column className="w-[120px] pr-4 align-top">
											<Img
												src={li.imageUrl}
												width="120"
												height="120"
												className="block rounded-xl shadow-md w-[120px] h-[120px] object-cover"
											/>
										</Column>
									)}

									{/* Text Content */}
									<Column className="align-top pt-0.5">
										<Text className="m-0 mb-1 font-bold leading-tight text-gray-900" style={{ fontSize: `${titleSize}px`, color: titleColor }}>
											{li.title}
										</Text>
										<Text className="m-0 leading-relaxed text-gray-500" style={{ fontSize: `${descSize}px`, color: descColor }}>
											{li.description}
										</Text>
									</Column>
								</Row>
							);
						})}
					</Section>
				</Tailwind>
			);
		default:
			return null;
	}
}
